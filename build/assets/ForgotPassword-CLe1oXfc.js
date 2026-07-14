import{r as e}from"./rolldown-runtime-S-ySWqyJ.js";import{X as t,it as n,st as r,v as i}from"./vendor-QvsXYPXi.js";import{t as a}from"./index-DUOaa3rc.js";var o=e(r(),1),s=i();function c(){let e=n(),[r,i]=(0,o.useState)(``),[c,l]=(0,o.useState)(``),[u,d]=(0,o.useState)(``),[f,p]=(0,o.useState)(``),[m,h]=(0,o.useState)(!1),[g,_]=(0,o.useState)(!1),[v,y]=(0,o.useState)(!1),b=async e=>{if(e.preventDefault(),!r){t.error(`Please enter username`);return}try{y(!0);let e=await a.post(`/sendForgotPasswordOtp`,{userName:r});e?.respCode===0?(console.log(e),t.success(e.respMsg),console.log(`send otp response-->>>`,e.respMsg),h(!0)):t.error(e.respMsg)}catch(e){t.error(e)}finally{y(!1)}},x=async()=>{if(!c){t.error(`Please enter OTP`);return}try{y(!0);let e=await a.post(`/verifyForgotPasswordOtp`,{userName:r,otp:c});e?.respCode===0?(t.success(e.respMsg),_(!0)):t.error(e.respMsg)}catch{t.error(`OTP Verification Failed`)}finally{y(!1)}},S={length:u.length>=8,uppercase:/[A-Z]/.test(u),lowercase:/[a-z]/.test(u),number:/[0-9]/.test(u),special:/[!@#$%^&*(),.?":{}|<>]/.test(u)};S.length&&S.uppercase&&S.lowercase&&S.number&&S.special;let C=async n=>{if(n.preventDefault(),!S.length||!S.uppercase||!S.lowercase||!S.number||!S.special){t.error(`Password must contain 8+ characters, uppercase, lowercase, number and special character`);return}if(!r||!u||!f){t(`Please fill all fields`,{icon:`⚠️`});return}if(u!==f){t.error(`Password and Confirm Password do not match`);return}try{y(!0);let n=await a.post(`/auth/submitForgotPassword`,{userName:r,password:u,confPassword:f});n?.respCode===0?(console.log(`rest password Message--->>>`,n?.respMsg),t.success(n?.respMsg),setTimeout(()=>{e(`/`)},1e3)):t.error(n?.respMsg)}catch(e){t.error(e)}finally{y(!1)}},w=(0,s.jsx)(`span`,{className:`text-red-500`,children:`*`});return(0,s.jsx)(`div`,{className:`min-h-screen bg-gray-100 flex items-center justify-center p-6`,children:(0,s.jsxs)(`div`,{className:`w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-visible grid grid-cols-1 md:grid-cols-2`,children:[(0,s.jsxs)(`div`,{className:`bg-orange-500 text-white p-10 flex flex-col justify-center`,children:[(0,s.jsx)(`h1`,{className:`text-4xl font-bold leading-tight mb-4`,children:`Reset Your Password`}),(0,s.jsx)(`p`,{className:`text-orange-100 text-lg mb-8`,children:`Secure your account by creating a strong new password.`}),(0,s.jsxs)(`div`,{className:`space-y-5 text-base`,children:[(0,s.jsxs)(`div`,{className:`flex items-center gap-3`,children:[(0,s.jsx)(`span`,{children:`🔒`}),(0,s.jsx)(`span`,{children:`Advanced account protection`})]}),(0,s.jsxs)(`div`,{className:`flex items-center gap-3`,children:[(0,s.jsx)(`span`,{children:`⚡`}),(0,s.jsx)(`span`,{children:`Fast and secure reset process`})]}),(0,s.jsxs)(`div`,{className:`flex items-center gap-3`,children:[(0,s.jsx)(`span`,{children:`🛡️`}),(0,s.jsx)(`span`,{children:`Encrypted password management`})]}),(0,s.jsxs)(`div`,{className:`flex items-center gap-3`,children:[(0,s.jsx)(`span`,{children:`📱`}),(0,s.jsx)(`span`,{children:`Accessible on all devices`})]})]}),(0,s.jsx)(`div`,{className:`mt-10 text-sm text-orange-100`,children:`Trusted secure authentication system`})]}),(0,s.jsx)(`div`,{className:`flex items-center justify-center p-8 bg-gray-50`,children:(0,s.jsxs)(`div`,{className:`w-full max-w-md bg-white rounded-2xl shadow-lg p-8`,children:[(0,s.jsx)(`div`,{className:`flex justify-center mb-6`,children:(0,s.jsx)(`img`,{src:`/logo1.avif`,alt:`Logo`,className:`h-14 object-contain`})}),(0,s.jsxs)(`div`,{className:`text-center mb-8`,children:[(0,s.jsx)(`h2`,{className:`text-3xl font-bold text-gray-800`,children:`Reset Your Password`}),(0,s.jsx)(`p`,{className:`text-gray-500 mt-2 text-sm`,children:`Enter your details to reset password`})]}),(0,s.jsxs)(`form`,{className:`space-y-5`,children:[(0,s.jsxs)(`div`,{className:`relative`,children:[(0,s.jsxs)(`label`,{className:`block text-sm font-medium text-gray-700 mb-2`,children:[`Username `,w]}),(0,s.jsx)(`input`,{type:`text`,value:r,maxLength:20,onChange:e=>i(e.target.value),placeholder:`Enter username`,className:`\r
                w-full\r
                border border-gray-300\r
                rounded-xl\r
                px-4 py-3\r
                pr-12\r
              `}),m&&(0,s.jsx)(`span`,{className:`absolute right-4 top-[42px] text-green-600 text-xl font-bold`,children:`✓`})]}),!m&&(0,s.jsx)(`button`,{type:`button`,onClick:b,disabled:v,className:`\r
                w-full\r
                bg-orange-500\r
                hover:bg-orange-600\r
                text-white\r
                py-3\r
                rounded-xl\r
                font-semibold\r
      `,children:v?`Sending...`:`Send OTP`}),m&&(0,s.jsxs)(`div`,{className:`relative`,children:[(0,s.jsxs)(`label`,{className:`block text-sm font-medium text-gray-700 mb-2`,children:[`OTP `,w]}),(0,s.jsx)(`input`,{type:`text`,value:c,maxLength:6,disabled:!m,onChange:e=>l(e.target.value),placeholder:`Enter OTP`,className:`
                  w-full
                  border border-gray-300
                  rounded-xl
                  px-4 py-3
                  pr-12
                  ${m?``:`bg-gray-100 cursor-not-allowed`}
                `}),g&&(0,s.jsx)(`span`,{className:`absolute right-4 top-[42px] text-green-600 text-xl font-bold`,children:`✓`})]}),m&&!g&&(0,s.jsx)(`button`,{type:`button`,onClick:x,disabled:v,className:`\r
                  w-full\r
                  bg-blue-500\r
                  hover:bg-blue-600\r
                  text-white\r
                  py-3\r
                  rounded-xl\r
                  font-semibold\r
      `,children:v?`Verifying...`:`Verify OTP`}),g&&(0,s.jsxs)(s.Fragment,{children:[(0,s.jsxs)(`div`,{className:`relative`,children:[(0,s.jsxs)(`label`,{className:`block text-sm font-medium text-gray-700 mb-2`,children:[`New Password `,w]}),(0,s.jsx)(`input`,{type:`password`,value:u,onChange:e=>d(e.target.value),placeholder:`Enter new password`,className:`\r
          w-full\r
          border border-gray-300\r
          rounded-xl\r
          px-4 py-3\r
          pr-12\r
        `}),u.length>0&&(0,s.jsx)(`span`,{className:`absolute right-4 top-[42px] text-green-600 text-xl font-bold`,children:`✓`})]}),(0,s.jsxs)(`div`,{className:`relative`,children:[(0,s.jsxs)(`label`,{className:`block text-sm font-medium text-gray-700 mb-2`,children:[`Confirm Password `,w]}),(0,s.jsx)(`input`,{type:`password`,value:f,onChange:e=>p(e.target.value),placeholder:`Confirm Password`,className:`\r
          w-full\r
          border border-gray-300\r
          rounded-xl\r
          px-4 py-3\r
          pr-12\r
        `}),f&&u===f&&(0,s.jsx)(`span`,{className:`absolute right-4 top-[42px] text-green-600 text-xl font-bold`,children:`✓`})]})]}),g&&(0,s.jsx)(`button`,{type:`button`,onClick:C,disabled:v,className:`\r
                  w-full\r
                  bg-green-600\r
                  hover:bg-green-700\r
                  text-white\r
                  py-3\r
                  rounded-xl\r
                  font-semibold\r
                `,children:v?`Processing...`:`Reset Password`}),(0,s.jsx)(`button`,{type:`button`,onClick:()=>e(`/`),className:`\r
                w-full\r
                border border-gray-300\r
                hover:bg-gray-100\r
                text-gray-700\r
                py-3\r
                rounded-xl\r
                font-medium\r
              `,children:`Back to Login`})]})]})})]})})}export{c as default};