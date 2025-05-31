import os
import logging

class FileManager:
    def __init__(self, base_path="documents"):
        self.base_path = base_path
        os.makedirs(base_path, exist_ok=True)
        logging.basicConfig(level=logging.DEBUG)
        self.logger = logging.getLogger(__name__)

    def save_file(self, filename, content):
        try:
            # Create directory if it doesn't exist
            full_path = os.path.join(self.base_path, filename)
            directory = os.path.dirname(full_path)
            os.makedirs(directory, exist_ok=True)
            
            print(f"Saving to path: {full_path}")  # Debug log
            print(f"Content length: {len(content)}")  # Debug log
            print(f"Content type: {type(content)}")  # Debug log
            print(f"Content preview: {content[:100]}")  # Debug log
            
            # Ensure content is a string
            if not isinstance(content, str):
                content = str(content)
            
            # Save the file
            with open(full_path, 'w', encoding='utf-8') as f:
                f.write(content)
                f.flush()  # Force write to disk
                os.fsync(f.fileno())  # Ensure it's written to disk
            
            # Verify the file was written
            if os.path.exists(full_path):
                with open(full_path, 'r', encoding='utf-8') as f:
                    saved_content = f.read()
                    print(f"Verified content length: {len(saved_content)}")  # Debug log
                    print(f"Verified content preview: {saved_content[:100]}")  # Debug log
                    if len(saved_content) != len(content):
                        raise Exception(f"Content verification failed - content length mismatch. Expected: {len(content)}, Got: {len(saved_content)}")
            else:
                print(f"File was not created: {full_path}")  # Debug log
                raise FileNotFoundError(f"Failed to create file: {full_path}")
                
        except Exception as e:
            print(f"Error saving file: {str(e)}")  # Debug log
            raise

    def load_file(self, filename):
        try:
            full_path = os.path.join(self.base_path, filename)
            print(f"Loading from path: {full_path}")  # Debug log
            
            if not os.path.exists(full_path):
                print(f"File does not exist: {full_path}")  # Debug log
                return ""
            
            with open(full_path, 'r', encoding='utf-8') as f:
                content = f.read()
                print(f"Loaded content length: {len(content)}")  # Debug log
                return content
        except Exception as e:
            print(f"Error loading file: {str(e)}")  # Debug log
            return ""

    def list_files(self, notebook=None):
        try:
            files = []
            # First check root directory
            root_files = [f for f in os.listdir(self.base_path) if os.path.isfile(os.path.join(self.base_path, f))]
            files.extend(root_files)
            
            # Then check subdirectories
            for root, _, filenames in os.walk(self.base_path):
                if root == self.base_path:  # Skip root directory as we already processed it
                    continue
                for filename in filenames:
                    rel_path = os.path.relpath(os.path.join(root, filename), self.base_path)
                    if notebook:
                        if rel_path.startswith(notebook):
                            files.append(rel_path)
                    else:
                        files.append(rel_path)
            return files
        except Exception as e:
            print(f"Error listing files: {str(e)}")  # Debug log
            return []

    def delete_file(self, filename):
        try:
            os.remove(os.path.join(self.base_path, filename))
            return True
        except FileNotFoundError:
            return False

    def rename_file(self, old_filename, new_filename):
        try:
            old_path = os.path.join(self.base_path, old_filename)
            new_path = os.path.join(self.base_path, new_filename)
            
            # Create directory for new file if it doesn't exist
            os.makedirs(os.path.dirname(new_path), exist_ok=True)
            
            os.rename(old_path, new_path)
            return True
        except (FileNotFoundError, OSError):
            return False
