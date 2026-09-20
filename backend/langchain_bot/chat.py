import os
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_openai import OpenAIEmbeddings, ChatOpenAI
from langchain_community.vectorstores import FAISS
from langchain.chains import ConversationalRetrievalChain

def build_chat_assistant(pdf_path: str):
    """
    Builds a RAG pipeline from the Gain Blueprint PDF.
    Candidates can ask questions about the process, and the assistant 
    retrieves the answer directly from the official guide.
    """
    # 1. Load document
    print(f"Loading document: {pdf_path}")
    loader = PyPDFLoader(pdf_path)
    documents = loader.load()

    # 2. Split into chunks
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    docs = text_splitter.split_documents(documents)

    # 3. Create embeddings & vector store
    # Ensure OPENAI_API_KEY is set in your environment
    embeddings = OpenAIEmbeddings()
    vectorstore = FAISS.from_documents(docs, embeddings)

    # 4. Setup conversation chain
    llm = ChatOpenAI(temperature=0.0, model_name="gpt-3.5-turbo")
    qa_chain = ConversationalRetrievalChain.from_llm(
        llm=llm,
        retriever=vectorstore.as_retriever(search_kwargs={"k": 3}),
        return_source_documents=True
    )
    
    return qa_chain

if __name__ == "__main__":
    # Example usage
    pdf_file = "../../TrainAIToGain_The_Gain_Blueprint.pdf"
    
    if not os.path.exists(pdf_file):
        print("Please place 'TrainAIToGain_The_Gain_Blueprint.pdf' in the root folder.")
    else:
        assistant = build_chat_assistant(pdf_file)
        chat_history = []
        
        print("LangChain Assistant ready! Ask a question about Mercor applying (type 'quit' to exit).")
        while True:
            query = input("Candidate: ")
            if query.lower() in ['quit', 'exit']:
                break
                
            result = assistant({"question": query, "chat_history": chat_history})
            print(f"Assistant: {result['answer']}\n")
            
            chat_history.append((query, result['answer']))
