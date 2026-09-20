import pytest
from unittest.mock import patch, MagicMock
from chat import build_chat_assistant

@patch('chat.OpenAIEmbeddings')
@patch('chat.FAISS')
@patch('chat.ChatOpenAI')
@patch('chat.PyPDFLoader')
@patch('chat.ConversationalRetrievalChain')
def test_build_chat_assistant(mock_crc, mock_pdf, mock_chat, mock_faiss, mock_embed):
    # Mocking
    mock_pdf_instance = MagicMock()
    mock_pdf_instance.load.return_value = ["mock_doc"]
    mock_pdf.return_value = mock_pdf_instance
    
    mock_vectorstore = MagicMock()
    mock_faiss.from_documents.return_value = mock_vectorstore
    
    mock_chain_instance = MagicMock()
    mock_crc.from_llm.return_value = mock_chain_instance

    # Run function
    assistant = build_chat_assistant("dummy.pdf")
    
    # Verify calls
    mock_pdf.assert_called_once_with("dummy.pdf")
    mock_pdf_instance.load.assert_called_once()
    mock_faiss.from_documents.assert_called_once()
    mock_crc.from_llm.assert_called_once()
    assert assistant == mock_chain_instance
