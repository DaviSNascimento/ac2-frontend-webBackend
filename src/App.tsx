import './App.css'
import { useState } from "react";
import ProjectModal, { Project } from './components/home'

function App() {
  // Lista de projetos adicionados
  const [projects, setProjects] = useState<Project[]>([]);

  // Projeto selecionado para o modal de visualização
  const [selected, setSelected] = useState<Project | null>(null);

  // Ao salvar projeto novo
  const handleAddProject = (project: Project) => {
    setProjects(prev => [...prev, project]);

    // Envio para backend REST
    fetch("https://seu-backend.com/api/projetos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(project)
    }).then(res => {
      if (!res.ok) console.error("Erro ao enviar projeto");
    });
  };

  return (
    <div className="container py-4">
      <h1 className="mb-4">Controle de Projetos</h1>
      <ProjectModal onSave={handleAddProject} />

      {/* Lista de projetos */}
      <ul className="list-group mt-4">
        {projects.map((p) => (
          <li
            key={p.id}
            className="list-group-item list-group-item-action"
            onClick={() => setSelected(p)}
            data-bs-toggle="modal"
            data-bs-target="#projectDetailModal"
          >
            {p.name}
          </li>
        ))}
      </ul>

      {/* Modal para visualizar os detalhes do projeto */}
      <div className="modal fade" id="projectDetailModal" tabIndex={-1}>
        <div className="modal-dialog">
          <div className="modal-content">

            {selected && (
              <>
                <div className="modal-header">
                  <h5 className="modal-title">{selected.name}</h5>
                  <button type="button" className="btn-close" data-bs-dismiss="modal" />
                </div>

                <div className="modal-body">
                  <p><strong>Descrição:</strong> {selected.description}</p>
                  <p><strong>Data de Início:</strong> {selected.dataInicio}</p>
                  <p><strong>Data de Fim:</strong> {selected.dataFim}</p>
                </div>

                <div className="modal-footer">
                  <button className="btn btn-secondary" data-bs-dismiss="modal">
                    Fechar
                  </button>
                </div>
              </>
            )}

          </div>
        </div>
      </div>
    </div>
  )
}

export default App
