import AcmeLogo from "../ui/acme-logo";
import LoginForm from "../ui/login-form";
import '@/styles/shiningButton.css';
import '@/styles/shiningButtonGray.css';

export default async function LoginPage(props: {
  searchParams?: Promise<{
    email?: string;
    password?: string;        
}>
}) {
  const searchParams = await props.searchParams;
  const email = searchParams?.email; 
  const password = searchParams?.password;

  console.log(`email = ${email} and Password = ${password}`);

    return (
      <main className="flex items-center justify-center md:h-screen" style={{ background: 'inear-gradient(to right,rgb(180, 227, 255)), rgb(180, 227, 255))' , padding: '20px'}}>
        <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4 md:-mt-32" style={{ background: 'inear-gradient(to right,rgb(180, 227, 255)), rgb(180, 227, 255))' , padding: '20px'}}>
          <div className="flex h-20 w-full items-end rounded-lg bg-blue-500 p-3 md:h-36" style={{ background: 'inear-gradient(to right,rgb(180, 227, 255)), rgb(180, 227, 255))' , padding: '20px'}}>
            <div className="text-white md:w-36">
              <AcmeLogo />
            </div>
          </div>
          <LoginForm email={email} password={password}/>
        </div>
      </main>
    );
  }