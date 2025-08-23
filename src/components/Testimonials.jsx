export default function Testimonials() {
  const testimonials = [
    {
      text: "It’s already been a huge increase in efficiency for me, personally. I’m really looking forward to a huge drop in scope for our tests that require new components (most of them).",
      name: "James Armenta",
      role: "Software Engineer",
      company: "Intuit",
      avatar: null,
    },
    {
      text: "Really excited about this UI to React components platform. Definitely see a bright future!",
      name: "Herminia Garcia",
      role: "Software Engineer",
      company: "Sidecar Health",
      avatar: null,
    },
    {
      text: "fellow UI engineers and designers, you should pay attention to what the folks over at @plasmicapp are doing. I’ve been using the beta and it is pretty excellent—this is certainly the future of component development.",
      name: "@voidwarren",
      role: "",
      company: "",
      avatar: null,
    },
    {
      text: "I had the opportunity to test out an early version of Plasmic and it’s awesome! Excited for the future of this design tool.",
      name: "Cole Bemis",
      role: "Design Systems Engineer",
      company: "GitHub",
      avatar: "/avatars/cole.jpg",
    },
    {
      text: "I was pleasantly surprised and at times, blown away, with the Plasmic approach to solving the problem. The whole concept of variants, interactive variants, and slots feels natural and intuitive.",
      name: "Justin Wilkerson",
      role: "Software Developer",
      company: "APS Physics",
      avatar: null,
    },
    {
      text: "We’re totally blown away many times a day because of Plasmic. You’re doing god’s work.",
      name: "Nitin Aggarwal",
      role: "Founder",
      company: "Supersorted.app",
      avatar: null,
    },
    {
      text: "By far one of the most empowering tools to come out in a while. If you’re a designer/no coder/visual developer who wants to make world class applications, or a design or development studio looking for a way to serve your clients better and faster—check out Plasmic.",
      name: "Collin Thompson",
      role: "CEO",
      company: "Intrepid Ventures",
      avatar: null,
    },
    {
      text: "Plasmic is the most important app to be released in the last five years.",
      name: "Tony Key",
      role: "Senior UX Designer",
      company: "Coupa Software",
      avatar: null,
    },
    {
      text: "After using this for about an hour, I’m convinced it’s the future.",
      name: "Max Gustafson",
      role: "Design Director",
      company: "Outdoorsy",
      avatar: null,
    },
    {
      text: "Watching @yaoang demo quickly creating #react components with ease using his app @plasmicapp for the second time tonight at a @_collab_lab exclusive presentation. AND I’m just as blown away as I was last time! Check out this app, y’all!",
      name: "Stacy Taylor",
      role: "Front-End Engineer",
      company: "Zapier",
      avatar: null,
    },
    {
      text: "I’m super surprised more folks aren’t talking about Plasmic — I just got a demo and it’s awesome. It’s like Figma and Webflow had a baby that outputs React code.",
      name: "Matt Varughese",
      role: "Partner",
      company: "8020",
      avatar: null,
    },
  ];

  return (
    <section className="px-6 py-20 bg-white">
      <div className="text-center mb-16">
        <span className="uppercase tracking-wide text-xs text-gray-500">
          The wall of love
        </span>
        <h2 className="text-4xl font-bold mt-3">
          Our customers <span className="text-pink-500">💜</span> us
        </h2>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
        {testimonials.map((t, i) => (
          <div
            key={i}
            className="p-6 rounded-2xl border border-gray-200 shadow-sm bg-white"
          >
            <p className="text-gray-700 text-sm">{t.text}</p>
            <div className="mt-4 flex items-center gap-3">
              {t.avatar ? (
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm">
                  {t.name.charAt(0)}
                </div>
              )}
              <div>
                <p className="text-sm font-medium text-gray-900">{t.name}</p>
                <p className="text-xs text-gray-500">
                  {t.role} {t.company && `• ${t.company}`}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
