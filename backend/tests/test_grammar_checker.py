import sys
import os
sys.path.insert(0, os.path.abspath(os.path.dirname(os.path.dirname(__file__))))
from grammar_checker import GrammarChecker, check_grammar

def test_grammar_checker_correction():
    grammar = GrammarChecker()
    text = "This is a bad example."
    result = grammar.check(text)
    assert any(c["original"] == "bad" and c["suggestion"] == "poor" for c in result["corrections"])

def test_check_grammar_function():
    text = "Some text."
    corrections = check_grammar(text)
    assert isinstance(corrections, list)
    assert corrections and "error" in corrections[0] and "suggestion" in corrections[0] 