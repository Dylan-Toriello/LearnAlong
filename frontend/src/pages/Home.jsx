import { LinkUploader } from "../components/LinkUploader";
import {Navbar} from "../components/Navbar";

export const Home = () => {
    return (
        <main className="h-screen flex flex-col overflow-hidden">
        
            <div className="flex-1 overflow-hidden">
                <LinkUploader />
            </div>
        </main>
    );
}