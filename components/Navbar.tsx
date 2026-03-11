import { Box } from "lucide-react";
import Button from "./ui/Button";
import { useOutletContext } from "react-router";

const Navbar = () => {
    const { isSignedIn, userName, signIn, signOut } = useOutletContext<AuthContext>();

    const handleAuthClick = async () => {
        if (isSignedIn) {
            try {
                await signOut();
            } catch (e) {
                console.error(`Ошибка выхода из Puter: ${e}`);
            }
            return;
        }

        try {
            await signIn();
        } catch (e) {
            console.error(`Ошибка входа через Puter: ${e}`);
        }
    };

    return (
        <header className="navbar">
            <nav className="inner">
                <div className="left">
                    <div className="brand">
                        <Box className="logo" />
                        <span className="name">Roomify</span>
                    </div>

                    
                </div>

                <div className="actions">
                    {isSignedIn ? (
                        <>
                            <span className="greeting">
                                {userName ? `Привет, ${userName}` : 'Вы вошли'}
                            </span>
                            <Button size="sm" onClick={handleAuthClick} className="btn">
                                Выйти
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button onClick={handleAuthClick} size="sm" variant="ghost">
                                Войти
                            </Button>
                            <a href="#upload" className="cta">Начать</a>
                        </>
                    )}
                </div>
            </nav>
        </header>
    );
};

export default Navbar;