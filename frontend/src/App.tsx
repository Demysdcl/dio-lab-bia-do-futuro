import { useMemo, useState } from "react";
import { InvestmentCard } from "./components/InvestmentCard";
import { profiles } from "./data/profiles";
import { createFollowUpPrompt, createInitialPrompt } from "./services/prompt";
import { requestGemini } from "./services/gemini";
import { extractJsonArray } from "./services/investments";
import type { Investment, InvestorProfile, Message } from "./types";

export function App() {
  const [selectedProfile, setSelectedProfile] = useState<InvestorProfile>("Conservador");
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedProfileData = useMemo(
    () => profiles.find((profile) => profile.name === selectedProfile) ?? profiles[0],
    [selectedProfile],
  );

  async function handleGenerate() {
    await runPrompt(createInitialPrompt(selectedProfile), "Gerar recomendacoes iniciais");
  }

  async function handleQuestionSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!question.trim()) {
      return;
    }

    const currentJson = JSON.stringify(investments, null, 2);
    const nextQuestion = question.trim();

    setMessages((current) => [
      ...current,
      {
        id: crypto.randomUUID(),
        role: "user",
        content: nextQuestion,
      },
    ]);
    setQuestion("");

    await runPrompt(createFollowUpPrompt(selectedProfile, nextQuestion, currentJson), nextQuestion);
  }

  async function runPrompt(prompt: string, messageLabel: string) {
    setIsLoading(true);
    setError(null);

    try {
      const response = await requestGemini(prompt);
      const parsedInvestments = extractJsonArray(response);

      setInvestments(parsedInvestments);
      setMessages((current) => [
        ...current,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: `${messageLabel}: ${parsedInvestments.length} recomendacoes recebidas.`,
        },
      ]);
    } catch (promptError) {
      setError(promptError instanceof Error ? promptError.message : "Erro inesperado ao consultar a IA.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="app-shell">
      <section className="hero">
        <div className="hero-content">
          <span className="eyebrow">Consultor financeiro com IA</span>
          <h1>Consultor de investimentos</h1>
          <p>
            Selecione o perfil de investidor, gere uma carteira sugerida pelo Gemini e continue refinando as
            recomendacoes com perguntas sobre investimentos.
          </p>
        </div>
      </section>

      <section className="workspace" aria-label="Consulta de investimentos">
        <aside className="profile-panel" aria-label="Perfis de investidor">
          <div>
            <span className="section-label">Perfil</span>
            <h2>Escolha uma estrategia</h2>
          </div>

          <div className="profile-options">
            {profiles.map((profile) => (
              <button
                className={profile.name === selectedProfile ? "profile-option selected" : "profile-option"}
                key={profile.name}
                onClick={() => setSelectedProfile(profile.name)}
                type="button"
              >
                <span>{profile.name}</span>
                <small>{profile.risk}</small>
              </button>
            ))}
          </div>

          <p className="profile-description">{selectedProfileData.shortDescription}</p>

          <button className="primary-button" disabled={isLoading} onClick={handleGenerate} type="button">
            {isLoading ? "Consultando..." : "Gerar recomendacoes"}
          </button>
        </aside>

        <section className="results-panel">
          <form className="question-form" onSubmit={handleQuestionSubmit}>
            <label htmlFor="question">Pergunte sobre a recomendacao</label>
            <div className="question-row">
              <input
                disabled={isLoading}
                id="question"
                onChange={(event) => setQuestion(event.target.value)}
                placeholder="Ex.: quais opcoes tem maior liquidez?"
                type="text"
                value={question}
              />
              <button disabled={isLoading || !question.trim()} type="submit">
                Enviar
              </button>
            </div>
          </form>

          {error ? <div className="alert">{error}</div> : null}

          {messages.length > 0 ? (
            <div className="message-log" aria-label="Historico da conversa">
              {messages.map((message) => (
                <p className={message.role} key={message.id}>
                  {message.content}
                </p>
              ))}
            </div>
          ) : null}

          <div className="results-header">
            <div>
              <span className="section-label">Recomendacoes</span>
              <h2>{investments.length > 0 ? `${investments.length} investimentos encontrados` : "Aguardando consulta"}</h2>
            </div>
            <span className="profile-pill">{selectedProfile}</span>
          </div>

          {investments.length > 0 ? (
            <div className="investment-list">
              {investments.map((investment) => (
                <InvestmentCard investment={investment} key={`${investment.categoria}-${investment.ativo}`} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <h3>Nenhuma carteira gerada ainda</h3>
              <p>Escolha um perfil e gere as recomendacoes para visualizar os investimentos e graficos.</p>
            </div>
          )}
        </section>
      </section>
    </main>
  );
}
