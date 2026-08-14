#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  tauri::Builder::default()
    .plugin(tauri_plugin_http::init())
    .setup(|app| {
      let quit_i = tauri::menu::MenuItem::with_id(app, "quit", "Quit", true, None::<&str>)?;
      let menu = tauri::menu::Menu::with_items(app, &[&quit_i])?;
      let _tray = tauri::tray::TrayIconBuilder::new()
        .menu(&menu)
        .on_menu_event(|app, event| {
            if event.id == tauri::menu::MenuId::new("quit") {
                app.exit(0);
            }
        })
        .icon(app.default_window_icon().unwrap().clone())
        .build(app)?;

      if cfg!(debug_assertions) {
        app.handle().plugin(
          tauri_plugin_log::Builder::default()
            .level(log::LevelFilter::Info)
            .build(),
        )?;
      }
      Ok(())
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
