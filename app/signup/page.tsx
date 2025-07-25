"use client"
export default function SignupPage() {
    return (
        <main className="w-full h-screen">

            <div className="flex items-center justify-center h-full">

                <div className="bg-white p-8 rounded shadow-md w-96">
                    <h1 className="text-2xl font-bold mb-4">Sign Up</h1>
                    <form>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-2" htmlFor="email">Email</label>
                            <input type="email" id="email" className="w-full p-2 border rounded" required />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-2" htmlFor="password">Password</label>
                            <input type="password" id="password" className="w-full p-2 border rounded" required />
                        </div>
                        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">Sign Up</button>
                    </form>
                </div>

            </div>

        </main>
    )
}