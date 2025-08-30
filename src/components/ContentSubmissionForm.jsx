import { useState } from 'react';
import "./globals.css";

const ContentSubmissionForm = () => {
  const [formData, setFormData] = useState({
    titleSuggestion: '',
    keywords: '',
    anchorText: '',
    targetAudience: '',
    wordCount: '',
    category: '',
    referenceLink: '',
    landingPageUrl: '',
    briefNote: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
  };

  return (
    <div className="content-form-container">
      <h1>Language*</h1>
      
      <div className="language-section">
        <h2>English</h2>
        <p className="note">Note: The publisher only accepts content in English</p>
      </div>

      <form onSubmit={handleSubmit} className="content-form">
        <div className="form-section">
          <h3>Title Suggestion</h3>
          <div className="form-group">
            <input
              type="text"
              name="titleSuggestion"
              value={formData.titleSuggestion}
              onChange={handleChange}
              placeholder="Suggest Title"
              className="form-input"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="keywords" className="required">Keywords*</label>
            <input
              type="text"
              id="keywords"
              name="keywords"
              value={formData.keywords}
              onChange={handleChange}
              placeholder="Provide Keywords; Separated by comma"
              className="form-input"
              required
            />
          </div>
        </div>

        <div className="form-section">
          <div className="form-group">
            <label htmlFor="anchorText" className="required">Anchor Text*</label>
            <input
              type="text"
              id="anchorText"
              name="anchorText"
              value={formData.anchorText}
              onChange={handleChange}
              placeholder="Enter Anchor text"
              className="form-input"
              required
            />
          </div>
        </div>

        <div className="form-section">
          <div className="form-group">
            <label htmlFor="targetAudience" className="required">Target Audience is from (Country)*</label>
            <select
              id="targetAudience"
              name="targetAudience"
              value={formData.targetAudience}
              onChange={handleChange}
              className="form-select"
              required
            >
              <option value="">Select Target Audience</option>
              <option value="us">United States</option>
              <option value="uk">United Kingdom</option>
              <option value="ca">Canada</option>
              <option value="au">Australia</option>
              <option value="in">India</option>
              {/* Add more countries as needed */}
            </select>
          </div>
        </div>

        <div className="form-section">
          <div className="form-group">
            <label htmlFor="wordCount" className="required">Word Count*</label>
            <select
              id="wordCount"
              name="wordCount"
              value={formData.wordCount}
              onChange={handleChange}
              className="form-select"
              required
            >
              <option value="">Select Word Count</option>
              <option value="500">500 words</option>
              <option value="1000">1000 words</option>
              <option value="1500">1500 words</option>
              <option value="2000">2000+ words</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="category" className="required">Category*</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="form-select"
              required
            >
              <option value="">Select Category</option>
              <option value="technology">Technology</option>
              <option value="health">Health</option>
              <option value="finance">Finance</option>
              <option value="education">Education</option>
              <option value="travel">Travel</option>
              {/* Add more categories as needed */}
            </select>
          </div>
        </div>

        <div className="form-section">
          <div className="form-group">
            <label htmlFor="referenceLink">Reference Link</label>
            <input
              type="url"
              id="referenceLink"
              name="referenceLink"
              value={formData.referenceLink}
              onChange={handleChange}
              placeholder="eg. https://example.com"
              className="form-input"
            />
          </div>
        </div>

        <div className="form-section">
          <div className="form-group">
            <label htmlFor="landingPageUrl" className="required">Landing Page URL*</label>
            <input
              type="url"
              id="landingPageUrl"
              name="landingPageUrl"
              value={formData.landingPageUrl}
              onChange={handleChange}
              placeholder="Enter Landing Page URL"
              className="form-input"
              required
            />
          </div>
        </div>

        <div className="form-section">
          <div className="form-group">
            <label htmlFor="briefNote">Brief Note</label>
            <textarea
              id="briefNote"
              name="briefNote"
              value={formData.briefNote}
              onChange={handleChange}
              placeholder="Brief Note: Any additional notes required can be specified here in detail."
              className="form-textarea"
              rows="4"
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="submit-button">
            Submit Content
          </button>
        </div>
      </form>
    </div>
  );
};

export default ContentSubmissionForm;