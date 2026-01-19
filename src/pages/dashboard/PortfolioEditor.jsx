import EditorLayout from "../../layouts/EditorLayout";
import Profile from "./Profile";
import Projects from "./Projects";
import Education from "./Education";
import Certifications from "./Certifications";
import Experience from "./Experience";
import Skills from "./Skills";
import Media from "./Media";
import PortfolioTemplate from "./PortfolioTemplate";

export default function PortfolioEditor() {
  return (
    <EditorLayout>
      {(activeTab) => (
        <>
          {activeTab === "profile" && <Profile />}
          {activeTab === "projects" && <Projects />}
          {activeTab === "education" && <Education />}
          {activeTab === "certifications" && <Certifications />}
          {activeTab === "experiences" && <Experience />}
          {activeTab === "skills" && <Skills />}
          {activeTab === "media" && <Media />}
          {activeTab === "templates" && <PortfolioTemplate />}
        </>
      )}
    </EditorLayout>
  );
}
