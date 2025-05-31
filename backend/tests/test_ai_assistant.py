import sys
import os
sys.path.insert(0, os.path.abspath(os.path.dirname(os.path.dirname(__file__))))
from ai_assistant import AIAssistant

def test_assist_reverses_prompt():
    ai = AIAssistant()
    prompt = "hello world"
    expected = "AI Suggestion: dlrow olleh"
    assert ai.assist(prompt) == expected 