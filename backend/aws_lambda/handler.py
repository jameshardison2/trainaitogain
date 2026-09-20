import json
import boto3
import urllib.parse
import os

s3 = boto3.client('s3')

def process_document(event, context):
    """
    AWS Lambda handler triggered by S3 ObjectCreate events.
    Simulates extracting text from a candidate's uploaded resume/document.
    """
    print("Received S3 event:", json.dumps(event))
    
    for record in event.get('Records', []):
        bucket_name = record['s3']['bucket']['name']
        object_key = urllib.parse.unquote_plus(record['s3']['object']['key'])
        
        print(f"Downloading {object_key} from {bucket_name}...")
        
        download_path = f"/tmp/{os.path.basename(object_key)}"
        
        try:
            # Download the file from S3 to temporary Lambda storage
            s3.download_file(bucket_name, object_key, download_path)
            
            # (Simulated) Resume Parsing Logic
            # In a real environment, you would use PyPDF2 or AWS Textract here.
            file_size = os.path.getsize(download_path)
            print(f"Downloaded file size: {file_size} bytes")
            
            # Analyze keywords against active waves
            # e.g., if "CPA" in document text -> match Finance Wave
            
            print(f"Successfully processed {object_key}")
            
        except Exception as e:
            print(f"Error getting object {object_key} from bucket {bucket_name}: {str(e)}")
            raise e

    return {
        'statusCode': 200,
        'body': json.dumps('Document processed successfully')
    }
