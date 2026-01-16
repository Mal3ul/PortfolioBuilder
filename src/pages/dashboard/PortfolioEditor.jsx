import EditorLayout from "../../layouts/EditorLayout";

export default function PortfolioEditor() {
  return (
    <EditorLayout>
      {(activeTab) => (
        <>
          {activeTab === "profile" && <ProfileSection />}
          {activeTab === "projects" && <ProjectsSection />}
          {activeTab === "education" && <EducationSection />}
          {activeTab === "certifications" && <CertificationsSection />}
          {activeTab === "experiences" && <ExperiencesSection />}
          {activeTab === "skills" && <SkillsSection />}
          {activeTab === "media" && <MediaSection />}
          {activeTab === "templates" && <TemplatesSection />}
        </>
      )}
    </EditorLayout>
  );
}
