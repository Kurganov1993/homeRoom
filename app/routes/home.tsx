import type { Route } from "./+types/home";
import Navbar from "../../components/Navbar";
import { ArrowRight, ArrowUpRight, Clock, Layers } from "lucide-react";
import Button from "../../components/ui/Button";
import Upload from "../../components/Upload";
import { useNavigate } from "react-router";
import { useEffect, useRef, useState } from "react";
import { createProject, getProjects } from "../../lib/puter.action";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Новое приложение React Router" },
    { name: "description", content: "Добро пожаловать в React Router!" },
  ];
}

export default function Home() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<DesignItem[]>([]);
  const isCreatingProjectRef = useRef(false);

  const handleUploadComplete = async (base64Image: string) => {
    try {
      if (isCreatingProjectRef.current) return false;
      isCreatingProjectRef.current = true;
      const newId = Date.now().toString();
      const name = `Residence ${newId}`;

      const newItem = {
        id: newId,
        name,
        sourceImage: base64Image,
        renderedImage: undefined,
        timestamp: Date.now(),
      };

      const saved = await createProject({ item: newItem, visibility: 'private' });

      if (!saved) {
        console.error("Не удалось создать проект");
        return false;
      }

      setProjects((prev) => [saved, ...prev]);

      navigate(`/visualizer/${newId}`, {
        state: {
          initialImage: saved.sourceImage,
          initialRendered: saved.renderedImage || null,
          name,
        },
      });

      return true;
    } finally {
      isCreatingProjectRef.current = false;
    }
  };

  useEffect(() => {
    const fetchProjects = async () => {
      const items = await getProjects();
      setProjects(items);
    };
    fetchProjects();
  }, []);

  return (
    <div className="home">
      <Navbar />

      <section className="hero">
        <div className="announce">
          <div className="dot">
            <div className="pulse"></div>
          </div>
          <p>Представляем Roomify 2.0</p>
        </div>

        <h1>Создавайте красивые пространства со скоростью мысли с Roomify</h1>

        <p className="subtitle">
          Roomify — это среда проектирования на основе ИИ, которая помогает
          визуализировать, рендерить и выпускать архитектурные проекты быстрее,
          чем когда-либо.
        </p>

        <div className="actions">
          <a href="#upload" className="cta">
            Начать создавать <ArrowRight className="icon" />
          </a>
          <Button variant="outline" size="lg" className="demo">
            Смотреть демо
          </Button>
        </div>

        <div id="upload" className="upload-shell">
          <div className="grid-overlay" />

          <div className="upload-card">
            <div className="upload-head">
              <div className="upload-icon">
                <Layers className="icon" />
              </div>
              <h3>Загрузите план помещения</h3>
              <p>Поддерживает форматы JPG, PNG до 10 МБ</p>
            </div>
            <Upload onComplete={handleUploadComplete} />
          </div>
        </div>
      </section>

      <section className="projects">
        <div className="section-inner">
          <div className="section-head">
            <div className="copy">
              <h2>Проекты</h2>
              <p>Ваши последние работы и проекты сообщества — всё в одном месте.</p>
            </div>
          </div>

          <div className="projects-grid">
            {projects.map(({ id, name, renderedImage, sourceImage, timestamp }) => (
              <div
                key={id}
                className="project-card group"
                onClick={() => navigate(`/visualizer/${id}`)}
              >
                <div className="preview">
                  <img src={renderedImage || sourceImage} alt="Проект" />
                  <div className="badge">
                    <span>Сообщество</span>
                  </div>
                </div>
                <div className="card-body">
                  <div>
                    <h3>{name}</h3>
                    <div className="meta">
                      <Clock size={12} />
                      <span>{new Date(timestamp).toLocaleDateString()}</span>
                      <span>От JS Mastery</span>
                    </div>
                  </div>
                  <div className="arrow">
                    <ArrowUpRight size={18} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}