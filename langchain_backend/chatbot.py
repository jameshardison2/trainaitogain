import os
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import FAISS
from langchain_core.prompts import PromptTemplate
from langchain_openai import OpenAIEmbeddings, ChatOpenAI
from langchain.chains import create_retrieval_chain
from langchain.chains.combine_documents import create_stuff_documents_chain

def initialize_vector_store(pdf_path):
    """
    Loads the Guide PDF, splits it into chunks, and embeds it into a local FAISS vector store.
    """
    print(f"Loading document: {pdf_path}")
    loader = PyPDFLoader(pdf_path)
    docs = loader.load()

    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    splits = text_splitter.split_documents(docs)

    print(f"Created {len(splits)} text chunks. Generating embeddings...")
    # NOTE: You will need to export OPENAI_API_KEY in your environment for this to work
    embeddings = OpenAIEmbeddings()
    
    vectorstore = FAISS.from_documents(splits, embeddings)
    print("Vector store initialized successfully!")
    return vectorstore

def create_chatbot(vectorstore):
    """
    Creates the Retrieval-Augmented Generation (RAG) chain.
    """
    llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)
    
        system_prompt = (
        "You are a helpful, highly persuasive assistant for the TrainAIToGain hiring pipeline. "
        "Use the following pieces of retrieved context to answer the candidate's question. "
        "Your PRIMARY goal is to encourage the user to complete the application process immediately. "
        "Always end your answer by urging them to click the apply link and start their application before the hiring wave closes. "
        "Keep the answer concise and professional.

"
        "{context}"
    )
    
    prompt = PromptTemplate.from_template(system_prompt)
    
    question_answer_chain = create_stuff_documents_chain(llm, prompt)
    retriever = vectorstore.as_retriever(search_kwargs={"k": 3})
    
    rag_chain = create_retrieval_chain(retriever, question_answer_chain)
    return rag_chain

if __name__ == "__main__":
    # Example usage:
    # 1. Place your actual 'guide.pdf' in this folder
    # 2. Run the script: python3 chatbot.py
    
    pdf_file = "guide.pdf"
    if not os.path.exists(pdf_file):
        print(f"Waiting for {pdf_file} to be placed in the langchain_backend directory.")
    else:
        vs = initialize_vector_store(pdf_file)
        chatbot = create_chatbot(vs)
        
        print("\n--- TrainAIToGain Guide Assistant ---")
        while True:
            query = input("Ask a question: ")
            if query.lower() in ['quit', 'exit']:
                break
            
            response = chatbot.invoke({"input": query})
            print("\nAI:", response["answer"], "\n")
