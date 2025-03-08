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
    <footer className="sticky  py-4 mt-10 rounded-t-xl">
      <hr className="h-px bg-gray-200 border-0 dark:bg-gray-700" />
      <div className="flex justify-between pt-4">
          <p className="dark:text-white  text-sm">
            © {new Date().getFullYear()} Omni. All rights reserved.
          </p>
          <p className="dark:text-white  text-sm">
            Gihan Chamila
          </p>
      </div>
    </footer>
  );
};

export default FooterSiteMap;