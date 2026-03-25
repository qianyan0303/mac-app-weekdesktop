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

                    // 桌面图标层，不遮挡普通应用
                    let _: () = msg_send![ns_window, setLevel: 9i64];
                }

                // 用空菜单替换默认菜单，彻底移除「关于」等所有菜单项
                use tauri::menu::Menu;
                let empty_menu = Menu::new(app)?;
                app.set_menu(empty_menu)?;
            }

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
