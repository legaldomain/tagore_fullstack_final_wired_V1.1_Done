export default function HelpPage() {
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Help & Support</h1>

      {/* Quick Start Guide */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Quick Start Guide</h2>
        <ul className="list-disc pl-6 text-sm text-gray-700">
          <li>Power On: Press and hold the power button for 3 seconds.</li>
          <li>Unlock: Use your fingerprint or enter your PIN.</li>
          <li>Write: Select a writing mode and start typing.</li>
          <li>Save: Your work is auto-saved, or press Ctrl+S to save manually.</li>
          <li>Export: Go to the export menu to save your work as a PDF or text file.</li>
        </ul>
      </section>

      {/* FAQs */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">FAQs</h2>
        <ul className="list-disc pl-6 text-sm text-gray-700">
          <li><strong>How do I change my PIN?</strong> Go to Settings > Security > Change PIN.</li>
          <li><strong>How do I switch writing modes?</strong> Use the mode selector on the home screen.</li>
          <li><strong>How do I backup my files?</strong> Connect to a USB or enable cloud sync in Settings.</li>
        </ul>
      </section>

      {/* Troubleshooting */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Troubleshooting</h2>
        <ul className="list-disc pl-6 text-sm text-gray-700">
          <li><strong>Device not turning on:</strong> Ensure the battery is charged. Press and hold the power button for 10 seconds.</li>
          <li><strong>Fingerprint not working:</strong> Clean the sensor and try again. Re-register your fingerprint if needed.</li>
          <li><strong>Slow performance:</strong> Restart the device or close unused applications.</li>
        </ul>
      </section>

      {/* Contact Support */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Contact Support</h2>
        <p className="text-sm text-gray-700">Need more help? Contact us:</p>
        <ul className="list-disc pl-6 text-sm text-gray-700">
          <li>Email: <a href="mailto:support@sonzaikan.com" className="text-indigo-600">support@sonzaikan.com</a></li>
          <li>Website: <a href="https://www.sonzaikan.com" target="_blank" rel="noopener noreferrer" className="text-indigo-600">www.sonzaikan.com</a></li>
        </ul>
      </section>

      {/* Feedback */}
      <section>
        <h2 className="text-xl font-semibold mb-2">Feedback</h2>
        <p className="text-sm text-gray-700">We value your feedback. Let us know how we can improve:</p>
        <textarea
          rows={4}
          placeholder="Write your feedback here..."
          className="w-full mt-2 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        ></textarea>
        <button className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
          Submit Feedback
        </button>
      </section>
    </div>
  );
}