import React, { useEffect } from 'react';
import Header from '../features/navigation/header';
import { useLocation } from 'react-router-dom';


function AboutUs() {
const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const element = document.querySelector(location.hash);
      if (element) {
        // Give it a short timeout to ensure the DOM is fully loaded
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }, [location]);

  return (
    <div className="min-h-screen bg-white">
      <Header />
            <div className="max-w-7xl mx-auto px-4 py-8 mt-16">
         <h1 className="text-3xl font-bold mb-6">About Us</h1>
         <p className="text-lg mb-4">
           Welcome to KP Collection, your one-stop destination for the latest in fashion and accessories. We are dedicated to providing you with the best quality clothing and accessories, with a focus on dependability, customer service, and uniqueness. Our passion for fashion drives us to bring you the latest trends and timeless classics.
         </p>
         <p className="text-lg mb-4">
           At KP Collection, we believe that fashion is not just about clothing, but a way to express yourself. Our carefully curated collection is designed to cater to all your fashion needs, whether you're looking for something casual, formal, or anything in between.
         </p>
         
         <h2 className="text-2xl font-bold mt-8 mb-4" id="terms-and-condition">Terms and Conditions</h2>
         <p className="text-lg mb-4">
           Welcome to KP Collection! By accessing or using our website (https://kpcollection.store/), you agree to comply with and be bound by the following Terms and Conditions. Please read them carefully before using our services. If you do not agree to these terms, please do not use our website.
         </p>
         <ol className="list-decimal list-inside text-lg mb-4">
           <li className="mb-2">
             <strong>General Information</strong>
             <p>Company Name: KP Collection</p>
           </li>
           <li className="mb-2">
             <strong>Use of the Website</strong>
             <ol className="list-decimal list-inside ml-4">
               <li>You agree to use the website only for lawful purposes and in accordance with these terms.</li>
               <li>You must not misuse this website by knowingly introducing viruses, trojans, or other malicious material.</li>
               <li>KP Collection reserves the right to restrict access to certain parts or all of the website at our discretion.</li>
             </ol>
           </li>
           <li className="mb-2">
             <strong>Products and Services</strong>
             <ol className="list-decimal list-inside ml-4">
               <li>KP Collection offers a range of clothing and related accessories.</li>
               <li>Product images on the website are for illustrative purposes. While we aim for accuracy, actual colors and designs may slightly vary due to screen settings or manufacturing variations.</li>
               <li>All products are subject to availability. We reserve the right to modify or discontinue products without prior notice.</li>
             </ol>
           </li>
           <li className="mb-2">
             <strong>Pricing and Payments</strong>
             <ol className="list-decimal list-inside ml-4">
               <li>All prices listed on the website are in [Insert Currency] and include applicable taxes unless stated otherwise.</li>
               <li>KP Collection reserves the right to change prices at any time without notice.</li>
               <li>Payment must be made via the payment methods specified on the website. Orders will only be processed upon successful payment confirmation.</li>
             </ol>
           </li>
           <li className="mb-2">
             <strong>Shipping and Delivery</strong>
             <ol className="list-decimal list-inside ml-4">
               <li>KP Collection offers shipping services as described on our website.</li>
               <li>Delivery times are estimates and may vary due to unforeseen circumstances.</li>
               <li>Customers are responsible for providing accurate shipping information. KP Collection is not liable for delays or misdelivery due to incorrect or incomplete addresses.</li>
             </ol>
           </li>
           <li className="mb-2">
             <strong>Returns and Refunds</strong>
             <ol className="list-decimal list-inside ml-4">
               <li>We accept returns and exchanges as outlined in our Return Policy, available on the website.</li>
               <li>Refunds will be processed to the original payment method within 5-7 after approval.</li>
               <li>Items must be returned in their original condition with tags intact. Customers are responsible for return shipping costs unless the return is due to a defect or error on our part.</li>
             </ol>
           </li>
           <li className="mb-2">
             <strong>Intellectual Property</strong>
             <ol className="list-decimal list-inside ml-4">
               <li>All content on the website, including text, images, logos, and designs, is the intellectual property of KP Collection unless stated otherwise.</li>
               <li>Unauthorized reproduction, distribution, or use of our intellectual property is prohibited.</li>
             </ol>
           </li>
           <li className="mb-2">
             <strong>Limitation of Liability</strong>
             <ol className="list-decimal list-inside ml-4">
               <li>KP Collection will not be liable for any indirect, incidental, or consequential damages arising from the use or inability to use our website or services.</li>
               <li>Our liability is limited to the amount paid for the product(s) in question.</li>
             </ol>
           </li>
           <li className="mb-2">
             <strong>Modifications to Terms and Conditions</strong>
             <ol className="list-decimal list-inside ml-4">
               <li>KP Collection reserves the right to update or modify these Terms and Conditions at any time. Changes will be effective immediately upon posting on the website.</li>
               <li>Your continued use of the website constitutes acceptance of any revised terms.</li>
             </ol>
           </li>
           <li className="mb-2">
             <strong>Governing Law</strong>
             <ol className="list-decimal list-inside ml-4">
               <li>These Terms and Conditions are governed by and construed in accordance with the laws of India.</li>
               <li>Any disputes arising under these terms shall be subject to the exclusive jurisdiction of the courts in India.</li>
             </ol>
           </li>
           <li className="mb-2">
             <strong>Contact Us</strong>
             <p>If you have any questions about these Terms and Conditions, please contact us:</p>
             <p>Email: Kpcollection25@gmail.com</p>
             <p>Phone: 8815601420</p>
           </li>
         </ol>
 
         <h2 className="text-2xl font-bold mt-8 mb-4" id="privacy-policy">Privacy Policy</h2>
         <p className="text-lg mb-4">
           KP Collection ("we," "our," or "us") values your privacy and is committed to protecting your personal information. This Privacy Policy outlines how we collect, use, and protect your data when you use our website (https://kpcollection.store/). By accessing or using our website, you agree to this Privacy Policy.
         </p>
         <ol className="list-decimal list-inside text-lg mb-4">
           <li>
             <strong>Information We Collect</strong>
             <ol className="list-decimal list-inside ml-4">
               <li>
                 <strong>Personal Information</strong>
                 <p>We may collect the following personal information when you interact with our website:</p>
                 <ul className="list-disc list-inside ml-4">
                   <li>Name</li>
                   <li>Email address</li>
                   <li>Phone number</li>
                   <li>Shipping and billing address</li>
                   <li>Payment details (processed securely by third-party payment providers)</li>
                 </ul>
               </li>
               <li>
                 <strong>Non-Personal Information</strong>
                 <p>We may also collect non-personal data, such as:</p>
                 <ul className="list-disc list-inside ml-4">
                   <li>IP address</li>
                   <li>Browser type and version</li>
                   <li>Device type</li>
                   <li>Browsing behavior on our website (e.g., pages visited, time spent)</li>
                 </ul>
               </li>
             </ol>
           </li>
           <li>
             <strong>How We Use Your Information</strong>
             <p>We use the information we collect for the following purposes:</p>
             <ol className="list-decimal list-inside ml-4">
               <li>Order Processing: To process and deliver your orders, manage payments, and provide updates.</li>
               <li>Customer Support: To respond to your inquiries, provide support, and resolve any issues.</li>
               <li>Personalization: To tailor your shopping experience and recommend products based on your preferences.</li>
               <li>Marketing: To send promotional emails, offers, and updates. You can opt out of marketing communications at any time.</li>
               <li>Website Improvement: To analyze website performance, improve functionality, and enhance user experience.</li>
             </ol>
           </li>
           <li>
             <strong>How We Share Your Information</strong>
             <p>We respect your privacy and do not sell your personal information. However, we may share your information with the following parties:</p>
             <ol className="list-decimal list-inside ml-4">
               <li>Service Providers: Third-party vendors who assist us with order fulfillment, payment processing, and website hosting.</li>
               <li>Legal Obligations: If required by law, we may disclose your information to comply with legal processes or protect our rights.</li>
               <li>Business Transfers: In the event of a merger, acquisition, or sale of assets, your information may be transferred as part of the transaction.</li>
             </ol>
           </li>
           <li>
             <strong>Data Security</strong>
             <p>We implement robust security measures to protect your personal information from unauthorized access, disclosure, or misuse. These include:</p>
             <ul className="list-disc list-inside ml-4">
               <li>Secure Sockets Layer (SSL) encryption for data transmission</li>
               <li>Regular monitoring of our systems for vulnerabilities</li>
               <li>Restricted access to your information by authorized personnel only</li>
             </ul>
             <p>While we strive to protect your data, no system is 100% secure. Please take steps to safeguard your information when using the internet.</p>
           </li>
           <li>
             <strong>Cookies and Tracking Technologies</strong>
             <p>Our website uses cookies and similar tracking technologies to:</p>
             <ul className="list-disc list-inside ml-4">
               <li>Improve website functionality</li>
               <li>Analyze user behavior</li>
               <li>Deliver personalized content and advertisements</li>
             </ul>
             <p>You can manage your cookie preferences through your browser settings. However, disabling cookies may affect your user experience.</p>
           </li>
           <li>
             <strong>Your Rights</strong>
             <p>You have the following rights regarding your personal information:</p>
             <ol className="list-decimal list-inside ml-4">
               <li>Access: Request access to the personal information we hold about you.</li>
               <li>Correction: Request corrections to any inaccurate or incomplete information.</li>
               <li>Deletion: Request the deletion of your personal information, subject to legal obligations.</li>
               <li>Opt-Out: Opt out of marketing communications by following the "unsubscribe" instructions in our emails.</li>
             </ol>
             <p>To exercise these rights, please contact us at Kpcollection25@gmail.com or 8815601420.</p>
           </li>
           <li>
             <strong>Third-Party Links</strong>
             <p>Our website may contain links to third-party websites. We are not responsible for the privacy practices or content of these websites. Please review their privacy policies before sharing any information.</p>
           </li>
           <li>
             <strong>Changes to This Privacy Policy</strong>
             <p>We may update this Privacy Policy periodically to reflect changes in our practices or legal requirements. Any updates will be posted on this page with the revised effective date. We encourage you to review this page regularly.</p>
           </li>
           <li>
             <strong>Contact Us</strong>
             <p>If you have any questions or concerns about this Privacy Policy, please contact us:</p>
             <p>Email: Kpcollection25@gmail.com</p>
             <p>Phone: 8815601420</p>
           </li>
         </ol>
 
         <h2 className="text-2xl font-bold mt-8 mb-4" id="return-and-refund-policy">Return and Refund Policy</h2>
 {/*         <p className="text-lg mb-4"> */}
 {/*           At KP Collection, customer satisfaction is our priority. If you are not completely satisfied with your purchase, we’re here to help with our straightforward return and refund policy.
         </p> */}
         <ol className="list-decimal list-inside text-lg mb-4">
           <li>
             <strong>Return Policy</strong>
             <ol className="list-decimal list-inside ml-4">
               <li>
                 <strong>Eligibility for Returns</strong>
                 <p>Items can be returned within 2 days from the date of delivery.</p>
                 <ul className="list-disc list-inside ml-4">
                   <li>Unused and in the same condition as received</li>
                   <li>In its original packaging with all tags attached</li>
                   <li>Free from any signs of wear, damage, or alteration</li>
                 </ul>
               </li>
               <li>
                 <strong>Non-Returnable Items</strong>
                 <p>The following items cannot be returned:</p>
                 <ul className="list-disc list-inside ml-4">
                   
                   <li>Customized or personalized items</li>
                 </ul>
               </li>
               <li>
                 <strong>Return Process</strong>
                 <p>Contact us within 2 days of receiving your order at Kpcollection25@gmail.com or 8815601420 to initiate the return.</p>
                 <p>Provide your order number, details of the item, and reason for the return.</p>
                 <p>Ship the item back to us at the address provided by our team. Customers are responsible for return shipping costs unless the item is defective or incorrect.</p>
               </li>
             </ol>
           </li>
           <li>
             <strong>Refund Policy</strong>
             <ol className="list-decimal list-inside ml-4">
               <li>
                 <strong>Refund Eligibility</strong>
                 <p>Refunds are processed for items returned in compliance with our Return Policy.</p>
                 <p>Refund requests must be made within 7 days from the date of delivery.</p>
               </li>
               <li>
                 <strong>Refund Process</strong>
                 <p>Once we receive and inspect the returned item, we will notify you about the approval or rejection of your refund.</p>
                 <p>Approved refunds will be credited to the original payment method within 5-7 business days.</p>
               </li>
               <li>
                 <strong>Partial Refunds</strong>
                 <p>Partial refunds may be issued for items returned:</p>
                 <ul className="list-disc list-inside ml-4">
                   <li>With minor signs of use</li>
                   <li>Missing original packaging or tags</li>
                 </ul>
               </li>
               <li>
                 <strong>Non-Refundable Costs</strong>
                 <p>Shipping charges (both original and return shipping) are non-refundable unless the return is due to our error.</p>
               </li>
             </ol>
           </li>
           <li>
             <strong>Defective or Incorrect Items</strong>
             <p>If you receive a defective or incorrect item:</p>
             <p>Contact us immediately at Kpcollection25@gmail.com or 8815601420 with photos of the item and a description of the issue.</p>
             <p>We will arrange for a replacement within 5 days or full refund, including shipping costs.</p>
           </li>
           <li>
             <strong>Shipping</strong>
             <p>All Orders will be delivered within 3-5 Business days.</p>
           </li>
           <li id="contact-us">
             <strong>Contact Us</strong>
             <p>For any questions or assistance regarding returns and refunds, please contact us:</p>
             <p>Email: Kpcollection25@gmail.com</p>
             <p>Phone: 8815601420</p>
           </li>
         </ol>
 
         <p className="text-lg mt-8">Thank you for choosing KP Collection!</p>
         <p className="text-lg mt-8 font-bold">This website is managed by SATYAM SHARMA</p>
       </div>
      
    </div>
  );
}

export default AboutUs
