import AuditLivres from '../../components/Administrateur/AuditLivres';
import Entete from '../../components/Administrateur/Entete'
import Logo from '../../assets/Logo.png'
import ParentHeader from '../../components/Administrateur/ParentHeader';
import { useState } from 'react';


function Livres(){
  const [searchItem , setSearchItem] = useState('')
    return (
        <div className='flex min-h-screen bg-gray-100'>
        <ParentHeader />  
      <div className='flex-1 ml-64 p-8'>
      <Entete searchItem={searchItem} setSearchItem={setSearchItem} />
          <h1 className="text-3xl font-semibold text-[#3F0071] dark:text-white flex items-center justify-center gap-4">
  Bienvenue chez LibraSphere <br />
  <img
    src={Logo}
    alt="Logo"
    className="w-10 h-10 object-contain shrink-0"
    style={{ maxWidth: '5rem', maxHeight: '5rem' }}
  />
</h1>
        <div className="p-8">
        <AuditLivres searchItem={searchItem}/>
        </div>
      </div>
      </div>
            
    )
}
export default Livres