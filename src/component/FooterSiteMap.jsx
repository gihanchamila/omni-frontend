import React from "react";

const FooterSiteMap = () => {
  const sections = [
    {
        title: "About Omni",
        links: ["About Us", "Our Team", "Careers", "Contact Us"],
    },
    {
        title: "Resources",
        links: ["Blog", "Guides", "Tutorials", "Case Studies"],
    },
    {
        title: "Popular Topics",
        links: ["Technology", "Health & Wellness", "Business", "Lifestyle"],
    },
    {
        title: "Follow Us",
        links: ["Instagram", "Facebook", "Twitter", "LinkedIn"],
    },
  ];

  return (
    <footer className="bg-gray-50 text-gray-500 py-12 mt-10 rounded-t-xl">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-[240px] gap-y-8">
          {sections.map((section, index) => (
            <div key={index}>
              <h3 className="text-lg font-semibold mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link, i) => (
                  <li key={i}>
                    <a
                      href="#"
                      className="text-gray-500 hover:text-gray-600 transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-8 text-center border-t border-gray-700 pt-4">
          <p className="text-gray-500 text-lg">
            © {new Date().getFullYear()} Omni. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default FooterSiteMap;