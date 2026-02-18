import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/Config";

export function useAllUserSteps() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const usersRef = collection(db, "users");
                const snapshot = await getDocs(usersRef);

                const result: any[] = [];

                snapshot.forEach(doc => {
                    const data = doc.data();

                    // Poimi vain ouluX-kentÃ¤t
                    const areaSteps = Object.fromEntries(
                        Object.entries(data).filter(([key]) => key.startsWith("oulu"))
                    );

                    result.push({
                        userId: doc.id,
                        username: data.username,
                        displayName: data.displayName,
                        userColor: data.userColor,
                        ...areaSteps
                    });
                });

                setUsers(result);
            } catch (err) {
                console.error("Error loading users:", err);
            } finally {
                setLoading(false);
            }
        };

        load();
    }, []);

    return { users, loading };
}