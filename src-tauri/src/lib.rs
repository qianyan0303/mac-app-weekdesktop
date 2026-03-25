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

                    // level = -1：低于所有普通应用窗口，但高于桌面壁纸
                    // 可以接收鼠标点击，不遮挡任何应用
                    let _: () = msg_send![ns_window, setLevel: (-1i64)];
                }

                // 用空菜单替换默认菜单，移除「关于」等菜单项
                use tauri::menu::Menu;
                let empty_menu = Menu::new(app)?;
                app.set_menu(empty_menu)?;
            }

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
