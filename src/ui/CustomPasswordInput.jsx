import { useState } from 'react';  

const CustomPasswordInput = () => {  
  const [password, setPassword] = useState('');  

  return (  
    <div className="mt-2 relative">  
      <input  
        id="password"  
        name="password"  
        type="password"  
        required  
        autoComplete="current-password"  
        className="absolute inset-0 opacity-0 cursor-text" // Hidden but still focusable  
        value={password}  
        onChange={(e) => setPassword(e.target.value)}  
      />  
      <div className="flex space-x-1">  
        {Array.from(password).map((char, index) => (  
          <div key={index} className="w-3 h-3 bg-[#A6A6A6] rounded-full"></div> // Larger circles for each character  
        ))}  
        {/* Placeholder for empty circles if password is less than desired length, e.g. 8 */}  
        {password.length < 8 && Array.from({ length: 8 - password.length }).map((_, index) => (  
          <div key={`placeholder-${index}`} className="w-3 h-3 bg-[#A6A6A6] rounded-full"></div>  
        ))}  
      </div>  
      <div className="text-gray-400 text-sm" style={{ marginTop: '0.2em' }}>  
        {password.length < 8 && 'Password must be at least 8 characters long'}  
      </div>  
    </div>  
  );  
};  

export default CustomPasswordInput;