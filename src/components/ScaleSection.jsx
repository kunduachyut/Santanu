import Image from "next/image";

export default function ScaleSection() {
  return (
    <section className="relative w-full px-6 py-20 bg-black text-center text-white">
      {/* Background grid / top pattern */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Optional background gradient/shadow */}
      </div>

      {/* Badge */}
      <span className="px-4 py-1 text-xs font-medium uppercase text-gray-300 tracking-wider">
        Scale Up
      </span>

      {/* Heading */}
      <h2 className="mt-6 text-4xl md:text-5xl font-bold">
        Scale without limits
      </h2>

      {/* Subheading */}
      <p className="mt-6 text-lg max-w-2xl mx-auto text-gray-400">
        Manage enterprise-level growth with ease. Scale up and maintain control,
        even as your application grows and evolves.
      </p>

      {/* CTA */}
      <div className="mt-8">
        <button className="px-6 py-3 rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white font-medium shadow-lg hover:opacity-90 transition">
          Get started →
        </button>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-3 gap-8 mt-16 max-w-6xl mx-auto">
        {/* SOC 2 Compliance */}
        <div className="p-6 rounded-xl bg-gradient-to-b from-gray-900 to-black border border-gray-800">
          <Image
            src="/images/soc2.png"
            alt="SOC 2 Compliance illustration"
            width={400}
            height={240}
            className="mx-auto"
          />
          <h3 className="mt-6 text-xl font-semibold">SOC 2 Compliance</h3>
          <p className="mt-3 text-gray-400 text-sm">
            Meets SOC 2 standards for secure handling of sensitive information.
          </p>
        </div>

        {/* SSO and Domain Capture */}
        <div className="p-6 rounded-xl bg-gradient-to-b from-gray-900 to-black border border-gray-800">
          <Image
            src="/images/sso.png"
            alt="SSO and Domain Capture illustration"
            width={400}
            height={240}
            className="mx-auto"
          />
          <h3 className="mt-6 text-xl font-semibold">SSO and Domain Capture</h3>
          <p className="mt-3 text-gray-400 text-sm">
            Available for both collaborators and end users of your application.
          </p>
        </div>

        {/* Fine-Grained Permissions */}
        <div className="p-6 rounded-xl bg-gradient-to-b from-gray-900 to-black border border-gray-800">
          <Image
            src="/images/permissions.png"
            alt="Fine-Grained Permissions illustration"
            width={400}
            height={240}
            className="mx-auto"
          />
          <h3 className="mt-6 text-xl font-semibold">Fine-Grained Permissions</h3>
          <p className="mt-3 text-gray-400 text-sm">
            Assign and manage fine-grained access controls within your apps.
          </p>
        </div>

        {/* Branching & Approvals */}
        <div className="p-6 rounded-xl bg-gradient-to-b from-gray-900 to-black border border-gray-800">
          <Image
            src="/images/branching.png"
            alt="Branching and Approvals illustration"
            width={400}
            height={240}
            className="mx-auto"
          />
          <h3 className="mt-6 text-xl font-semibold">Branching & Approvals</h3>
          <p className="mt-3 text-gray-400 text-sm">
            Collaborate at scale by working on isolated copies, then review and
            merge when ready.
          </p>
        </div>

        {/* Shared Libraries */}
        <div className="p-6 rounded-xl bg-gradient-to-b from-gray-900 to-black border border-gray-800">
          <Image
            src="/images/shared.png"
            alt="Shared Libraries illustration"
            width={400}
            height={240}
            className="mx-auto"
          />
          <h3 className="mt-6 text-xl font-semibold">Shared Libraries</h3>
          <p className="mt-3 text-gray-400 text-sm">
            Centrally manage assets across your organization. Import and reuse
            within various projects with ease.
          </p>
        </div>

        {/* On-Premise Deployment */}
        <div className="p-6 rounded-xl bg-gradient-to-b from-gray-900 to-black border border-gray-800">
          <Image
            src="/images/deployment.png"
            alt="On-Premise Link Deployment illustration"
            width={400}
            height={240}
            className="mx-auto"
          />
          <h3 className="mt-6 text-xl font-semibold">
            On-Premise Link Deployment
          </h3>
          <p className="mt-3 text-gray-400 text-sm">
            Deploy links on-premise or behind content for enhanced control and
            reach.
          </p>
        </div>
      </div>
    </section>
  );
}
