#[cfg(target_os = "macos")]
#[macro_use]
extern crate objc;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![])
        .setup(|app| {
            use tauri::Manager;
            let window = app.get_webview_window("main").unwrap();

            #[cfg(target_os = "macos")]
            {
                use cocoa::appkit::NSWindowCollectionBehavior;
                use cocoa::base::id;

                let ns_window = window.ns_window().unwrap() as id;

                unsafe {
                    // 跟随所有桌面空间，切换 Space 不消失
                    let behavior =
                        NSWindowCollectionBehavior::NSWindowCollectionBehaviorCanJoinAllSpaces
                        | NSWindowCollectionBehavior::NSWindowCollectionBehaviorStationary
                        | NSWindowCollectionBehavior::NSWindowCollectionBehaviorIgnoresCycle;
                    let _: () = msg_send![ns_window, setCollectionBehavior: behavior];

                    // 浮动层：在普通窗口上方但不影响交互
                    // NSFloatingWindowLevel = 3
                    let _: () = msg_send![ns_window, setLevel: 3i64];
                }
            }

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
