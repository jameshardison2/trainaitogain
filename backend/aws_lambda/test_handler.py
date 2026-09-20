import json
import pytest
from unittest.mock import patch, MagicMock
from handler import process_document

@patch('handler.s3')
@patch('handler.os.path.getsize')
def test_process_document(mock_getsize, mock_s3):
    # Mock file size return
    mock_getsize.return_value = 1024

    # Simulate S3 event payload
    event = {
        "Records": [
            {
                "s3": {
                    "bucket": {
                        "name": "trainaitogain-resumes"
                    },
                    "object": {
                        "key": "candidate-resume.pdf"
                    }
                }
            }
        ]
    }

    # Call handler
    response = process_document(event, None)
    
    # Assertions
    assert response['statusCode'] == 200
    assert json.loads(response['body']) == 'Document processed successfully'
    
    # Verify s3 download was called with correct parameters
    mock_s3.download_file.assert_called_once_with(
        'trainaitogain-resumes', 
        'candidate-resume.pdf', 
        '/tmp/candidate-resume.pdf'
    )
