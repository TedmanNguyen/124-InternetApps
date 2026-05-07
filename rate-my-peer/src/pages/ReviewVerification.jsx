import React, {useState} from 'react';

function VerificationForm() {
    const [courseID, setCourseID] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewURL, setPreviewURL] = useState(null);

    //Handle file selection
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            //create temp url to show preview of image
            setPreviewURL(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); //prevent pages from refreshing

        if (!selectedFile) {
            alert("Please upload a screenshot first!");
            return;
        }

        //backendwork
        const formData = new FormData();
        formData.append('courseID', courseID);
        formData.append('screenshot', selectedFile);

        console.log("Submitting...", { courseID, fileName: selectedFile.name});

        //placeholder for api call
        alert('Success! Course ${courseid} and image ${selectedFile.name} are ready to submit')
    };

    return (
    <div style={{ maxWidth: '500px', margin: '20px auto', fontFamily: 'sans-serif' }}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        
        {/* Course ID Input */}
        <div>
          <label style={{ display: 'block', marginBottom: '5px' }}>Course ID</label>
          <input 
            type="text" 
            value={courseID}
            onChange={(e) => setCourseID(e.target.value)}
            placeholder="Enter Course ID"
            required
            style={{ width: '100%', padding: '10px' }}
          />
        </div>

        {/* File Input */}
        <div>
          <label style={{ display: 'block', marginBottom: '5px' }}>Upload Screenshot</label>
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleFileChange}
            required
          />
        </div>

        {/* Image Preview */}
        {previewUrl && (
          <div style={{ marginTop: '10px' }}>
            <p style={{ fontSize: '12px', color: '#666' }}>Preview:</p>
            <img 
              src={previewUrl} 
              alt="Preview" 
              style={{ width: '100%', borderRadius: '8px', border: '1px solid #ddd' }} 
            />
          </div>
        )}

        <button type="submit" style={{ padding: '12px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Submit to Admin
        </button>
      </form>
    </div>
  );
}

export default VerificationForm;


