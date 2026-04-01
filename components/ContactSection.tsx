import { useLocale } from '../contexts/LocaleContext';

const DISCORD_URL = 'https://discord.com/';
const DISCORD_LABEL = 'Discord';

interface ContactSectionItem {
  title: string;
  body: string;
  linkLabel?: string;
  linkUrl?: string;
}

export const ContactSection = () => {
  const { isEnglish } = useLocale();
  const content = isEnglish
    ? {
        title: 'Get in touch',
        intro: '',
        sections: [
          {
            title: 'Community',
            body:
              'Talk to our community on Discord, share feedback, and ask questions about the models.',
            linkLabel: DISCORD_LABEL,
            linkUrl: DISCORD_URL,
          },
          {
            title: 'Projects and partnerships',
            body:
              'We develop projects and applications with peer organizations to promote access to high-quality public data, algorithms, and models. We are always open to new ideas.',
          },
          {
            title: 'Research collaboration',
            body:
              'Reach out if you want to explore evaluations, benchmarks, applied research, or technical exchanges around public-sector AI.',
          },
        ],
      }
    : {
        title: 'Entre em contato',
        intro: '',
        sections: [
          {
            title: 'Comunidade',
            body:
              'Fale com nossa comunidade no Discord, compartilhe feedback e tire dúvidas sobre os modelos.',
            linkLabel: DISCORD_LABEL,
            linkUrl: DISCORD_URL,
          },
          {
            title: 'Projetos e parcerias',
            body:
              'Desenvolvemos projetos e aplicações com organizações parceiras para promover o acesso a dados públicos, algoritmos e modelos de alta qualidade. Estamos sempre abertos a novas ideias.',
          },
          {
            title: 'Colaboração em pesquisa',
            body:
              'Entre em contato se quiser explorar avaliações, benchmarks, pesquisa aplicada ou trocas técnicas sobre IA para o setor público.',
          },
        ],
      };

  return (
    <section
      aria-label={isEnglish ? 'Contact us' : 'Fale conosco'}
      className="min-h-[calc(100vh-5rem)] bg-white"
    >
      <div className="mx-auto max-w-4xl px-6 py-14 sm:px-10 lg:px-12">
        <div className="max-w-3xl">
          <div className="flex items-center justify-between gap-6">
            <h1 className="bg-[linear-gradient(90deg,#429FEB_0%,#3F38AC_100%)] bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-5xl">
              {content.title}
            </h1>
            <a
              href={DISCORD_URL}
              target="_blank"
              rel="noreferrer"
              aria-label={isEnglish ? 'Open Discord' : 'Abrir Discord'}
              className="shrink-0 transition-transform duration-200 hover:scale-105"
            >
              <img
                src="/logos/discord-icon-isolated-white-background-social-media-app-round-button-logo-sign-symbol_989822-4749.avif"
                alt="Discord"
                className="h-14 w-14 rounded-full object-cover"
              />
            </a>
          </div>
          {content.intro ? (
            <p className="mt-8 text-lg leading-9 text-slate-500">{content.intro}</p>
          ) : null}

          <div className="mt-12 space-y-10">
            {(content.sections as ContactSectionItem[]).map((section) => (
              <div key={section.title}>
                <h2 className="text-[2rem] font-semibold tracking-tight text-slate-900 sm:text-[2.15rem]">
                  {section.title}
                </h2>
                <p className="mt-4 text-lg leading-9 text-slate-500">
                  {section.linkLabel && section.linkUrl
                    ? (() => {
                        const [before, after] = section.body.split(section.linkLabel);
                        return (
                          <>
                            {before}
                            <a
                              href={section.linkUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[#2F5FBE] hover:underline"
                            >
                              {section.linkLabel}
                            </a>
                            {after}
                          </>
                        );
                      })()
                    : section.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
