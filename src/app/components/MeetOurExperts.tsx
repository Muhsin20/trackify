"use client";
import React from "react";
import { Fade } from "react-awesome-reveal";
import Image from "next/image";

interface Expert {
  name: string;
  role: string;
  photo: string;
  social: {
    linkedin: string;
    email: string;
  };
}

const MeetOurExperts: React.FC<{ experts: Expert[] }> = ({ experts }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
      {experts.map((expert, index) => (
        <Fade key={index} direction="up" triggerOnce>
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex flex-col items-center">
              {/* Profile Image */}
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-purple-100 mb-6">
                <Image
                  src={expert.photo}
                  alt={expert.name}
                  width={128}
                  height={128}
                  className="object-cover w-full h-full"
                  loader={({ src }) => `${src}?w=100&h=100`}
                />
              </div>

              {/* Details */}
              <h3 className="text-xl font-bold text-gray-800">{expert.name}</h3>
              <p className="text-gray-600 mb-4">{expert.role}</p>

              {/* Social Links */}
              <div className="flex space-x-4">
                <a
                  href={expert.social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-600 hover:text-purple-800 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </a>

                <a
                  href={`mailto:${expert.social.email}`}
                  className="text-purple-600 hover:text-purple-800 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 12.713l-11.985-9.713h23.97l-11.985 9.713zm0 2.574l-12-9.725v15.438h24v-15.438l-12 9.725z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </Fade>
      ))}
    </div>
  );
};

export default MeetOurExperts;