#[cfg_attr(mobile, tauri::mobile_entry_point)]
use tauri::command;
use std::fs;

#[command]
fn load_image_as_base64(path: String) -> Result<String, String> {
    match fs::read(path) {
        Ok(bytes) => Ok(format!("data:image/jpeg;base64,{}", base64::encode(&bytes))),
        Err(err) => Err(err.to_string()),
    }
}

pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_autostart::init(
            tauri_plugin_autostart::MacosLauncher::LaunchAgent,
            None,
        ))
        .plugin(tauri_plugin_single_instance::init(|_app, _args, _cwd| {}))
        .plugin(tauri_plugin_sql::Builder::new().build())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![load_image_as_base64])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
