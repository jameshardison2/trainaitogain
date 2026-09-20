# Step 2: AWS Infrastructure Setup

Since we don't want to accidentally expose your AWS keys, I have outlined the exact steps you need to take in your AWS Console to stand up the S3 Bucket and Lambda permissions.

## 1. Create the S3 Bucket
1. Go to the **S3 Console** and click **Create bucket**.
2. Name it something like: `trainaitogain-resumes-prod`.
3. **Uncheck** "Block all public access" (we need candidates to upload files).
4. Save and create the bucket.

## 2. Configure CORS (Crucial for Frontend Uploads)
Because candidates will be uploading files directly from `trainaitogain.com`, you must tell S3 to accept requests from your domain.
1. Click on your new bucket -> **Permissions** tab.
2. Scroll down to **Cross-origin resource sharing (CORS)** and click Edit.
3. Paste this exact JSON:
```json
[
    {
        "AllowedHeaders": [
            "*"
        ],
        "AllowedMethods": [
            "PUT",
            "POST"
        ],
        "AllowedOrigins": [
            "https://trainaitogain.com",
            "https://trainaitogain-50c19.web.app",
            "http://localhost:5000"
        ],
        "ExposeHeaders": []
    }
]
```

## 3. Create the Lambda Function & IAM Role
1. Go to the **Lambda Console** and click **Create function**.
2. Name it `ProcessCandidateResume`.
3. Select **Python 3.12** as the runtime.
4. Under **Execution Role**, choose "Create a new role with basic Lambda permissions".
5. Once created, go to the **Configuration -> Permissions** tab and click the Role name.
6. Attach the policy: `AmazonS3ReadOnlyAccess` (so Lambda can download the PDFs).

## 4. Link S3 to Lambda
1. In your Lambda function, click **Add trigger**.
2. Select **S3**.
3. Choose your `trainaitogain-resumes-prod` bucket.
4. Event type: `All object create events`.
5. Click **Add**.

Once you have this configured, we can move to Step 3 and build the frontend UI so candidates can actually upload their PDFs!
