import csv
import json

# File paths
input_csv_path = 'HateSpeechDataset1.csv'
output_jsonl_path = 'HateSpeechDataset1.jsonl'

# Open the input CSV and output JSONL files
with open(input_csv_path, 'r', encoding='utf-8') as csv_file, open(output_jsonl_path, 'w', encoding='utf-8') as jsonl_file:
    reader = csv.DictReader(csv_file)

    for row in reader:
        content = row.get('Content', '').strip()
        label = row.get('Label', '').strip()

        # Convert label to response text
        if label == '1':
            response = "yes"
        elif label == '0':
            response = "no"
        else:
            continue  # skip rows with invalid labels

        # Build the JSON structure
        json_obj = {
            "contents": [
                {
                    "role": "user",
                    "parts": [
                        { "text": content }
                    ]
                },
                {
                    "role": "model",
                    "parts": [
                        { "text": response }
                    ]
                }
            ]
        }

        # Write to JSONL file
        jsonl_file.write(json.dumps(json_obj, ensure_ascii=False) + '\n')

print("✅ Conversion complete. Output saved to", output_jsonl_path)
