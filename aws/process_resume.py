import json
import urllib.parse
import boto3
import io

# Initialize S3 client
s3 = boto3.client('s3')

def lambda_handler(event, context):
    """
    AWS Lambda function triggered by an S3 ObjectCreated event.
    Extracts text from the uploaded PDF resume.
    """
    print("Received event: " + json.dumps(event, indent=2))

    # Get the bucket and object key from the Event
    bucket = event['Records'][0]['s3']['bucket']['name']
    key = urllib.parse.unquote_plus(event['Records'][0]['s3']['object']['key'], encoding='utf-8')

    try:
        # 1. Fetch the file from S3
        response = s3.get_object(Bucket=bucket, Key=key)
        pdf_bytes = response['Body'].read()
        print(f"Successfully downloaded {key} from {bucket}. Size: {len(pdf_bytes)} bytes.")

        # 2. Extract text (using PyPDF2 as an example)
        # Note: You will need to package PyPDF2 with your Lambda deployment
        import PyPDF2
        pdf_reader = PyPDF2.PdfReader(io.BytesIO(pdf_bytes))
        extracted_text = ""
        
        for page_num in range(len(pdf_reader.pages)):
            page = pdf_reader.pages[page_num]
            extracted_text += page.extract_text() + "\n"

        print("--- Extracted Text ---")
        print(extracted_text[:500] + "...") # Print first 500 chars for logging

        # 3. Future Step: Candidate-to-role Keyword Matching
        # Here we would compare 'extracted_text' against our waves.json roles
        
        return {
            'statusCode': 200,
            'body': json.dumps(f'Successfully processed {key}')
        }

    except Exception as e:
        print(f"Error getting object {key} from bucket {bucket}.")
        print(e)
        raise e
