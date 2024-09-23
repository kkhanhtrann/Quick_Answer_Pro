// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod aimodel;
use aimodel::AIModel;
use std::env;
use tokio;

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
async fn submit_question(image_base64: String) -> Result<String, String> {
    let prompt  = "Please analyze the provided image. If the image contains a question, provide just the straight answer needed to solve it. If the image does not appear to be a question, respond with the text ‘this might not be a question’.".to_string();
    //Create an instance of the AIModel
    let ai_model = AIModel::new("API NEEDED".to_string());

    //Analyze the image
    match ai_model.analyze_image(&prompt, &image_base64).await {
        Ok(description) => Ok(description),
        Err(e) => Err(format!("{}", e.to_string())),
    }
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![greet, submit_question])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");

    Ok(())
}
