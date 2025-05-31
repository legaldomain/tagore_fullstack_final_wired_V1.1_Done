
class GrammarChecker:
    def check(self, text: str) -> dict:
        # Simulated grammar corrections
        corrections = []
        if "bad" in text:
            corrections.append({"original": "bad", "suggestion": "poor"})
        return {"corrections": corrections}

def check_grammar(text):
    # Dummy implementation for now
    return [{"error": "Example mistake", "suggestion": "Example correction"}]
