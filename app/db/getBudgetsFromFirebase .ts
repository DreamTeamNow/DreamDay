import { db } from './firebase'
import { collection, getDocs } from 'firebase/firestore'; 

export const getBudgetsFromFirebase = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'budget'));
    const budgets = querySnapshot.docs.map(doc => doc.data()); // Zwraca pełne dane dokumentów
    return budgets;
  } catch (error) {
    throw new Error("Błąd podczas pobierania budżetów z Firebase: " + error);
  }
};

