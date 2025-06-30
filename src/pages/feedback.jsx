import React, { useState } from "react";
import logo from "../../src/assets/kinpluslogo.png";

const FeedbackForm = () => {
  const initialForm = {
    fullName: "",
    department: "",
    wentWell: "",
    didntGoWell: "",
    challenges: "",
    lessons: "",
    shoutOuts: "",
    startDoing: "",
    stopDoing: "",
    continueDoing: "",
    suggestions: "",
    followUp: "",
    ratings: {
      teamCollab: "",
      crossTeamCollab: "",
      workLifeBalance: "",
      productivity: "",
      orgInput: "",
    },
  };

  const [form, setForm] = useState(initialForm);
  const [step, setStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const departments = [
    "Software Development",
    "Digital Marketing",
    "Accounting",
    "Data Analysis",
    "Design",
    "Cybersecurity",
    "Product Management",
    "Human Resources",
  ];

  const pages = [
    [
      ["fullName", "Full Name"],
      ["department", "Department / Team"],
      [
        "wentWell",
        "What went well this month? (Share your personal win, team win or anything)",
      ],
      ["didntGoWell", "What didn't go well or could have gone better?"],
    ],
    [
      ["challenges", "Share Challenges, blockers or areas for improvement"],
      ["lessons", "What did you learn this month?"],
      ["shoutOuts", "Any Shout outs / appreciation for team members"],
    ],
    [
      ["startDoing", "Start Doing"],
      ["stopDoing", "Stop Doing"],
      ["continueDoing", "Continue Doing"],
    ],
    [
      ["teamCollab", "Team Collaboration"],
      ["crossTeamCollab", "Cross-Team Collaboration"],
      ["workLifeBalance", "Work-Life Balance"],
      ["productivity", "Personal Productivity"],
      ["orgInput", "Input at Organisation Level"],
      ["suggestions", "Suggestions or ideas for improvement"],
      ["followUp", "Would you like a follow-up conversation?"],
    ],
  ];

  const isRating = (name) => Object.keys(form.ratings).includes(name);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (isRating(name)) {
      setForm({
        ...form,
        ratings: {
          ...form.ratings,
          [name]: value,
        },
      });
    } else {
      setForm({
        ...form,
        [name]: value,
      });
    }
  };

  const isStepValid = () => {
    for (let [name] of pages[step]) {
      if (name === "shoutOuts") continue;
      if (isRating(name) && !form.ratings[name]) return false;
      if (!isRating(name) && !form[name]) return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isStepValid()) {
      alert("Please fill out all required fields.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(
        "https://feedback-9ahh.onrender.com/api/feedback",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );

      if (!response.ok) throw new Error("Failed to submit feedback");
      alert("✅ Feedback submitted successfully!");
      setForm(initialForm);
      setStep(0);
    } catch (error) {
      console.error("Submission error:", error);
      alert("There was an error submitting your feedback.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto text-black shadow-md rounded-lg p-6 space-y-4"
    >
      <div className="flex justify-center items-center">
        <img src={logo} alt="" className="w-40 md:w-60" />
      </div>
      <h2 className="text-2xl font-bold mb-4 text-center">
        Staff Monthly Feedback Form
      </h2>

      <p className="text-center text-gray-700 mb-4">
        We value your voice! This monthly feedback form helps us understand your
        experiences, challenges, and ideas so we can continue to grow together.
        Your honest input is essential in improving our team culture,
        productivity, and overall satisfaction. All responses are confidential
        and will be used constructively.
      </p>

      {step === 2 && (
        <p className="mb-2 font-semibold text-lg">
          Let's improve our workflow/culture, what should we:
        </p>
      )}

      {step === 3 && (
        <p className="mb-2 font-semibold text-lg">
          How would you rate the following? (1 - Poor, 2 - Fair, 3 - Good, 4 -
          Very good, 5 - Excellent)
        </p>
      )}

      {pages[step].map(([name, label]) => (
        <div key={name}>
          <label className="block font-semibold mb-1">{label}</label>

          {name === "department" || name === "followUp" ? (
            <div className="relative">
              <select
                name={name}
                value={form[name]}
                onChange={handleChange}
                className="w-full p-2 pr-10 border border-gray-300 text-black bg-white rounded-md appearance-none"
                required
              >
                {name === "department" ? (
                  <>
                    <option value="">-- Select Department / Team --</option>
                    {departments.map((dep) => (
                      <option key={dep} value={dep}>
                        {dep}
                      </option>
                    ))}
                  </>
                ) : (
                  <>
                    <option value="">-- Select an option --</option>
                    <option value="Yes, please reach out">
                      Yes, please reach out
                    </option>
                    <option value="No, I am good">No, I am good</option>
                    <option value="Only if necessary">
                      Only if necessary
                    </option>
                  </>
                )}
              </select>

              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                <svg
                  className="w-4 h-4 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6 9l6 6 6-6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          ) : isRating(name) ? (
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() =>
                    setForm((prev) => ({
                      ...prev,
                      ratings: {
                        ...prev.ratings,
                        [name]: String(num),
                      },
                    }))
                  }
                  className={`w-10 h-10 rounded-full border flex items-center justify-center font-bold transition
                    ${
                      form.ratings[name] === String(num)
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white text-blue-600 border-blue-600 hover:bg-blue-100"
                    }`}
                >
                  {num}
                </button>
              ))}
            </div>
          ) : (
            <textarea
              name={name}
              value={form[name]}
              onChange={(e) => {
                handleChange(e);
                e.target.style.height = "auto";
                e.target.style.height = e.target.scrollHeight + "px";
              }}
              rows={1}
              className="w-full p-2 border border-gray-300 text-black bg-white rounded-md resize-none overflow-hidden"
              required={name !== "shoutOuts"}
            />
          )}
        </div>
      ))}

      <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden mt-6">
        <div
          className="bg-blue-600 h-3 transition-all duration-300"
          style={{ width: `${((step + 1) / pages.length) * 100}%` }}
        />
      </div>

      <div className="flex justify-between pt-4">
        <button
          type="button"
          onClick={() => setStep(step - 1)}
          disabled={step === 0}
          className="bg-blue text-blue-700 font-semibold py-2 px-4 rounded disabled:opacity-50"
        >
          Previous
        </button>

        {step === pages.length - 1 ? (
          <button
            type="submit"
            disabled={isSubmitting || !isStepValid()}
            className="bg-white text-blue-700 font-semibold py-2 px-4 rounded flex items-center justify-center"
          >
            {isSubmitting ? (
              <span className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-blue-700"></span>
            ) : (
              "Submit"
            )}
          </button>
        ) : (
          <button
            type="button"
            onClick={() => {
              if (isStepValid()) {
                setStep(step + 1);
              } else {
                alert("Please fill out all required fields before proceeding.");
              }
            }}
            className="bg-white text-blue-700 font-semibold py-2 px-4 rounded"
          >
            Next
          </button>
        )}
      </div>
    </form>
  );
};

export default FeedbackForm;
