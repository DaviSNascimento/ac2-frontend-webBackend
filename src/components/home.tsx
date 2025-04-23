import { useState } from "react";

export type Project = {
  id: number;
  name: string;
  description: string;
  dataInicio: string;
  dataFim: string;
};

type ProjectModalProps = {
  onSave: (project: Project) => void;
};

export default function ProjectModal({ onSave }: ProjectModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");

  const formatDateToMMDDYY = (dateString: string) => {
    const [year, month, day] = dateString.split("-"); // vem como YYYY-MM-DD
    return `${month}/${day}/${year.slice(2)}`;        // retorna MM/DD/YY
  };

  const handleSubmit = async () => {
    const newProject: Project = {
      id: Date.now(),
      name,
      description,
      dataInicio: formatDateToMMDDYY(dataInicio),
      dataFim: formatDateToMMDDYY(dataFim),
    };

    // Chama função do componente pai
    onSave(newProject);

    // Envia para backend como JSON
    try {
      const response = await fetch("http://localhost:8080/projetos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          descricao: newProject.description,
          dataInicio: newProject.dataInicio,
          dataFim: newProject.dataFim,
        }),
      });

      if (!response.ok) {
        throw new Error("Erro ao enviar projeto");
      }

      const result = await response.json();
      console.log("Projeto enviado com sucesso:", result);
    } catch (error) {
      console.error("Erro ao enviar projeto:", error);
    }

    // Limpa os campos
    setName("");
    setDescription("");
    setDataInicio("");
    setDataFim("");

    // Fecha o modal
    (document.getElementById("closeModalBtn") as HTMLElement).click();
  };

  return (
    <>
      {/* Botão para abrir o modal */}
      <button className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#addProjectModal">
        Adicionar Projeto
      </button>

      {/* Modal */}
      <div className="modal fade" id="addProjectModal" tabIndex={-1}>
        <div className="modal-dialog">
          <div className="modal-content">

            {/* Cabeçalho */}
            <div className="modal-header">
              <h5 className="modal-title">Novo Projeto</h5>
              <button id="closeModalBtn" type="button" className="btn-close" data-bs-dismiss="modal" />
            </div>

            {/* Corpo do modal */}
            <div className="modal-body">
              <label className="form-label">Título</label>
              <input
                className="form-control mb-2"
                placeholder="Nome do Projeto"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <label className="form-label">Descrição</label>
              <textarea
                className="form-control mb-2"
                placeholder="Descrição"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />

              <label className="form-label">Data de Início</label>
              <input
                type="date"
                className="form-control mb-2"
                value={dataInicio}
                onChange={(e) => setDataInicio(e.target.value)}
              />

              <label className="form-label">Data de Fim</label>
              <input
                type="date"
                className="form-control"
                value={dataFim}
                onChange={(e) => setDataFim(e.target.value)}
              />
            </div>

            {/* Rodapé com botões */}
            <div className="modal-footer">
              <button className="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
              <button className="btn btn-success" onClick={handleSubmit}>Salvar</button>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
