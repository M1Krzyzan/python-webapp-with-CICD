import os
import threading
from dotenv import load_dotenv
from pymongo import MongoClient
from pymongo.errors import ServerSelectionTimeoutError


class MongoDBClient:
    _instance = None
    _lock = threading.Lock()

    def __new__(cls):
        """Singleton pattern to create a shared MongoDB client instance."""
        if not cls._instance:
            with cls._lock:
                if not cls._instance:
                    load_dotenv()  # Load environment variables from .env file
                    mongo_user = os.getenv("MONGO_USER")
                    mongo_password = os.getenv("MONGO_PASSWORD")
                    mongo_uri = (
                        f"mongodb+srv://{mongo_user}:"
                        f"{mongo_password}@paim.yxyyk.mongodb.net/"
                    )
                    try:
                        # Create a MongoDB client
                        cls._instance = MongoClient(
                            mongo_uri, serverSelectionTimeoutMS=5000
                        )
                        # Test the connection
                        cls._instance.admin.command("ping")
                    except ServerSelectionTimeoutError as e:
                        raise RuntimeError("Could not connect to MongoDB") from e
        return cls._instance

    @staticmethod
    def get_database():
        """
        Get the database instance from the MongoDB client.

        Returns:
            The database instance.
        """
        # Load the database name from environment variables
        load_dotenv()
        mongo_database = os.getenv("MONGO_DATABASE")
        if not mongo_database:
            raise ValueError("MONGO_DATABASE is not set in the .env file")

        return MongoDBClient()[mongo_database]

    @staticmethod
    def get_collection(collection_name: str):
        """
        Get a collection from the MongoDB database.

        Args:
            collection_name (str): The name of the collection.

        Returns:
            The requested collection.
        """
        database = MongoDBClient.get_database()
        return database[collection_name]
