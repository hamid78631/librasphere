import '../../styles/Admin/AuditJournal.css';
import { motion } from 'framer-motion';

function AuditJournal() {
  const auditEntries = [
    {
      date: '26/04/2025',
      user: 'admin',
      action: 'Connexion',
      details: 'Connexion réussie à 17:05'
    },
    {
      date: '26/04/2025',
      user: 'admin',
      action: 'Suppression',
      details: 'Livre ID #145 supprimé'
    },
    {
      date: '27/04/2025',
      user: 'moderator',
      action: 'Ajout',
      details: 'Ajout du livre "Librasphere: L’Odyssée"'
    },
    {
      date: '27/04/2025',
      user: 'admin',
      action: 'Modification',
      details: 'Modification du rôle utilisateur ID #32'
    }
  ];

  const getBadgeClass = (action) => {
    switch (action) {
      case 'Suppression':
        return 'badge badge-suppression';
      case 'Ajout':
        return 'badge badge-ajout';
      case 'Modification':
        return 'badge badge-modification';
      case 'Connexion':
      default:
        return 'badge badge-connexion';
    }
  };

  return (
    <div className="audit-container flex-1 p-8 bg-gray-100 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="audit-card"
      >
        <h1 className="audit-title">
          Journal d'Audit
        </h1>

        <div className="overflow-x-auto ">
          <table className="audit-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Utilisateur</th>
                <th>Action</th>
                <th>Détails</th>
              </tr>
            </thead>
            <tbody>
              {auditEntries.map((entry, index) => (
                <tr key={index}>
                  <td>{entry.date}</td>
                  <td>{entry.user}</td>
                  <td>
                    <span className={getBadgeClass(entry.action)}>
                      {entry.action}
                    </span>
                  </td>
                  <td>{entry.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}

export default AuditJournal;
