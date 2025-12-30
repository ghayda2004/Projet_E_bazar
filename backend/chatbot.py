# chatbot.py
from llama_cpp import Llama

# Charger le modèle LLaMA

model_path = "models/llama-2-7b-chat-hf-q4_k_m.gguf"  # chemin vers modele
llm = Llama(model_path=model_path, n_ctx=4096)  # n_ctx = max tokens
print("Modèle chargé !")

# FAQ simple
faq = {
    "livraison": "Nos livraisons prennent entre 2 et 5 jours.",
    "paiement": "Nous acceptons carte bancaire, D17, et e-dinar.",
    "retour": "Tu peux retourner un article sous 14 jours.",
    "support": "Tu peux nous contacter via notre email.",
    "horaires": "Notre service client est disponible de 9h à 18h du lundi au vendredi.",
    "produits": "Nous avons une large gamme de produits allant de l'électronique aux vêtements.",
    "promotions": "Nous offrons des promotions spéciales chaque semaine, reste à l'affût !",
}

def find_answer(question):
    """Recherche une réponse dans la FAQ selon les mots-clés."""
    question_lower = question.lower()
    for key in faq:
        if key in question_lower:
            return faq[key]
    return None

def ask_zaraa_local(question):
    prompt = f"""
    Tu es Zaraa, assistante tunisienne pour le site ElBazar.
    Réponds de manière amicale, authentique tunisienne et utile.
    Question : {question}
    """
    result = llm(prompt, max_tokens=500)
    print("Réponse brute du modèle :", result)  # Debug
    return result["choices"][0]["text"]

# Boucle interactive
print("👋 Aslema, je suis Zaraa ! Tape 'exit' pour quitter.")
while True:
    user_input = input("Toi : ")
    if user_input.lower() in ["exit", "quit"]:
        print("Zaraa : À bientôt 💛 !")
        break

    # Vérifier la FAQ avant le modèle
    answer = find_answer(user_input)
    if answer:
        print("Zaraa :", answer)
    else:
        print("Zaraa :", ask_zaraa_local(user_input).strip())  