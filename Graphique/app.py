from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import sqlite3
import csv
import tempfile
from datetime import datetime


app = Flask(__name__)
CORS(app)

def creation():
   
    with sqlite3.connect("visites_bd") as conn:
      
        conn.execute("""
            CREATE TABLE IF NOT EXISTS visites(
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                date_visite TEXT
            )
        """)
        conn.execute("""
            CREATE TABLE IF NOT EXISTS livres(
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                titre TEXT NOT NULL,
                categorie TEXT NOT NULL  
            )
        """)
        conn.execute("""
            CREATE TABLE IF NOT EXISTS emprunts(
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                livre_id INTEGER,
                date_emprunt TEXT,
                date_retour TEXT,
                date_retour_prevue TEXT,
                FOREIGN KEY (livre_id) REFERENCES livres(id)
            )
        """)

        conn.execute("""
        CREATE TABLE IF NOT EXISTS adherents(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nom TEXT NOT NULL,
        date_naissance TEXT NOT NULL
        )
        """)


creation()

@app.route('/log-visit', methods=['POST'])
def log_visite():
    date_visite = datetime.now().strftime('%d-%m-%Y')
    with sqlite3.connect("visites_bd") as conn:
        conn.execute("INSERT INTO visites(date_visite) VALUES(?)", (date_visite,))
    return jsonify({"message": "visite enregistrée"}), 201

@app.route('/stats/visites-par-jour', methods=['GET'])
def get_stats():
    with sqlite3.connect("visites_bd") as conn:
        cursor = conn.cursor()
        cursor.execute("""
            SELECT date_visite, COUNT(*)
            FROM visites
            GROUP BY date_visite
            ORDER BY date_visite DESC
        """)
        resultat = cursor.fetchall()
        stats = [{"date": row[0], "visites": row[1]} for row in resultat]
        return jsonify(stats)

@app.route('/stats/livres-populaires', methods=['GET'])
def livres_populaires():
    with sqlite3.connect("visites_bd") as conn:
        cursor = conn.cursor()
        cursor.execute("""
            SELECT livres.titre, COUNT(emprunts.id) AS nombre_emprunts
            FROM livres
            LEFT JOIN emprunts ON livres.id = emprunts.livre_id
            GROUP BY livres.id
            ORDER BY nombre_emprunts DESC
            LIMIT 10
        """)
        resultat = cursor.fetchall()
        stats = [{"titre": row[0], "emprunts": row[1]} for row in resultat]
        return jsonify(stats)

@app.route('/emprunter', methods=['POST'])
def emprunter_livre():
    data = request.get_json()
    livre_id = data.get('livre_id')
    if not livre_id:
        return jsonify({"error": "livre_id manquant"}), 400
    date_emprunt = datetime.now().strftime('%Y-%m-%d')
    date_retour_prevue = (datetime.now() + timedelta(days=7)).strftime('%Y-%m-%d')
    with sqlite3.connect("visites_bd") as conn:
        conn.execute("""
            INSERT INTO emprunts (livre_id, date_emprunt, date_retour_prevue)
            VALUES (?, ?, ?)
        """, (livre_id, date_emprunt, date_retour_prevue))
    return jsonify({"message": "Emprunt enregistré avec succès"}), 201

@app.route('/stats/emprunts-par-jour', methods=['GET'])
def emprunts_par_jour():
    with sqlite3.connect("visites_bd") as conn:
        cursor = conn.cursor()
        cursor.execute("""
            SELECT date_emprunt, COUNT(*) AS total
            FROM emprunts
            GROUP BY date_emprunt
            ORDER BY date_emprunt DESC
        """)
        resultat = cursor.fetchall()
        stats = [{"date": row[0], "emprunts": row[1]} for row in resultat]
        return jsonify(stats)

@app.route('/stats/emprunts-par-semaine', methods=['GET'])
def emprunts_par_semaine():
    with sqlite3.connect("visites_bd") as conn:
        cursor = conn.cursor()
        cursor.execute("""
            SELECT strftime('%W-%Y', date_emprunt) AS semaine, COUNT(*)
            FROM emprunts
            GROUP BY semaine
            ORDER BY semaine DESC
        """)
        resultat = cursor.fetchall()
        stats = [{"semaine": row[0], "emprunts": row[1]} for row in resultat]
        return jsonify(stats)

@app.route('/stats/taux-occupation-par-jour', methods=['GET'])
def taux_occupation_par_jour():
    with sqlite3.connect("visites_bd") as conn:
        cursor = conn.cursor()

        # Récupérer le nombre total de livres
        cursor.execute("SELECT COUNT(*) FROM livres")
        total_livres = cursor.fetchone()[0]

        # Compter les emprunts par date
        cursor.execute("""
            SELECT date_emprunt, COUNT(*) as total_emprunts
            FROM emprunts
            GROUP BY date_emprunt
            ORDER BY date_emprunt
        """)
        data = cursor.fetchall()

        stats = []
        for date_str, emprunts in data:
            taux = emprunts / total_livres if total_livres > 0 else 0
            stats.append({
                "date": date_str,
                "taux_occupation": round(taux, 2)
            })

        return jsonify(stats)

@app.route('/stats/taux-retard-evolution', methods=['GET'])
def taux_retard_evolution():
    with sqlite3.connect("visites_bd") as conn:
        cursor = conn.cursor()

        cursor.execute("""
            SELECT date_retour_prevue, date_retour
            FROM emprunts
            WHERE date_retour IS NOT NULL AND date_retour > date_retour_prevue
        """)
        retards = cursor.fetchall()

        # Dictionnaire pour stocker les jours de retard par mois
        par_mois = {}

        for prevue, retour in retards:
            try:
                d_prevue = datetime.strptime(prevue, "%Y-%m-%d")
                d_retour = datetime.strptime(retour, "%Y-%m-%d")
                retard_jours = (d_retour - d_prevue).days
                mois = d_retour.strftime("%Y-%m")  # ex: "2025-05"

                if mois not in par_mois:
                    par_mois[mois] = []

                par_mois[mois].append(retard_jours)
            except ValueError:
                continue  # skip invalid formats

        # Calcul de la moyenne par mois
        stats= [
            {"mois": mois, "retard_moyen": round(sum(jours)/len(jours), 2)}
            for mois, jours in sorted(par_mois.items())
        ]

        return jsonify(stats)


@app.route('/export/emprunts', methods=['GET'])
def export_emprunts_csv():
    with sqlite3.connect("visites_bd") as conn:
        cursor = conn.cursor()
        cursor.execute("""
            SELECT livres.titre, date_emprunt, date_retour_prevue, date_retour
            FROM emprunts
            JOIN livres ON livres.id = emprunts.livre_id
        """)
        rows = cursor.fetchall()
        temp = tempfile.NamedTemporaryFile(mode='w', newline='', delete=False, suffix='.csv')
        writer = csv.writer(temp)
        writer.writerow(["Titre", "Date Emprunt", "Date Retour Prévue", "Date Retour"])
        writer.writerows(rows)
        temp.close()
        return send_file(temp.name, as_attachment=True)

@app.route('/stats/evolution', methods=['GET'])
def evolution_activité():
    periode = request.args.get('periode', 'jour')
    with sqlite3.connect("visites_bd") as conn:
        cursor = conn.cursor()
        if periode == 'semaine':
            group_format = "%W-%Y"
        elif periode == "mois":
            group_format = "%m-%Y"
        else:
            group_format = "%d-%m-%Y"
        cursor.execute(f"""
            SELECT strftime('{group_format}', date_emprunt) AS periode, COUNT(*) AS total
            FROM emprunts
            GROUP BY periode
            ORDER BY periode DESC
        """)
        rows = cursor.fetchall()
        stats = [{"periode": row[0], "emprunts": row[1]} for row in rows]
        return jsonify(stats)

@app.route('/stats/emprunts-par-categorie', methods=['GET'])
def emprunts_par_categorie():
    with sqlite3.connect("visites_bd") as conn:
        cursor = conn.cursor()
        cursor.execute("""
            SELECT livres.categorie, COUNT(emprunts.id) AS nombre_emprunts
            FROM livres
            LEFT JOIN emprunts ON livres.id = emprunts.livre_id
            GROUP BY livres.categorie
            ORDER BY nombre_emprunts DESC
        """)
        resultat = cursor.fetchall()
        stats = [{"categorie": row[0], "emprunts": row[1]} for row in resultat]
        return jsonify(stats)


@app.route('/stats/livres-disponibles', methods=['GET'])
def livres_disponibles():
    with sqlite3.connect("visites_bd") as conn:
        cursor = conn.cursor()
        cursor.execute("""
            SELECT livres.titre
            FROM livres
            LEFT JOIN emprunts ON livres.id = emprunts.livre_id
            WHERE emprunts.id IS NULL
        """)
        resultat = cursor.fetchall()
        livres = [{"titre": row[0]} for row in resultat]
        return jsonify(livres)

@app.route('/stats/adherent', methods=['GET'])
def adherents():
    with sqlite3.connect("visites_bd") as conn:
        cursor = conn.cursor()
        cursor.execute("""
            SELECT COUNT(DISTINCT emprunts.id) AS total_adherents
            FROM emprunts
        """)
        resultat = cursor.fetchone()
        return jsonify({"adherents": resultat[0]})

@app.route('/stats/livres-retard', methods=['GET'])
def livres_retard():
    with sqlite3.connect("visites_bd") as conn:
        cursor = conn.cursor()
        cursor.execute("""
            SELECT livres.titre, emprunts.date_retour_prevue, emprunts.date_retour
            FROM emprunts
            JOIN livres ON livres.id = emprunts.livre_id
            WHERE emprunts.date_retour IS NOT NULL
            AND emprunts.date_retour > emprunts.date_retour_prevue
        """)
        resultat = cursor.fetchall()
        retards = [{"titre": row[0], "retour_prevu": row[1], "retour": row[2]} for row in resultat]
        return jsonify(retards)



@app.route('/stats/adherents-par-tranche-age',methods=['GET'])  
def adherents_par_age() : 
    def age_tranche(age) :
        if age <18:
            return "Adolescents"  
        elif age <30:
            return "Jeunes Adultes"
        elif age <60:
            return "Adultes"
        else:
            return "Séniors"

    with sqlite3.connect("visites_bd") as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT date_naissance FROM adherents")
        rows = cursor.fetchall()

    now = datetime.now()
    tranches = {}
    for row in rows:
        naissance = datetime.strptime(row[0], "%Y-%m-%d")
        age = (now - naissance).days // 365
        tranche = age_tranche(age)
        tranches[tranche] = tranches.get(tranche, 0) + 1

    return jsonify([
        {"tranche": k, "total": v} for k, v in tranches.items()
    ])   

@app.route('/stats/cadrans', methods=['GET'])
def cadrans():
    with sqlite3.connect("visites_bd") as conn:
        cursor = conn.cursor()

        # Total des adhérents
        cursor.execute("SELECT COUNT(*) FROM adherents")
        total_adherents = cursor.fetchone()[0]

        # Total des livres
        cursor.execute("SELECT COUNT(*) FROM livres")
        total_livres = cursor.fetchone()[0]

        return jsonify({
            "adherents": total_adherents,
            "livres": total_livres
        })



if __name__ == '__main__':
    app.run(debug=True)