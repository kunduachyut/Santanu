import Image from "next/image";

export default function PublishSection() {
    return (
        <div className="relative w-full flex justify-center items-center py-16 bg-gradient-to-br from-white to-purple-50 rounded-3xl shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-6xl w-full px-8">
                {/* Left Section */}
                <div className="flex flex-col justify-center space-y-6">
                    <div className="absolute top-6 flex space-x-4">
                        <button className="px-5 py-2 rounded-full border border-purple-400 text-purple-600 hover:bg-purple-50 transition">
                            Connect
                        </button>
                        <button className="px-5 py-2 rounded-full border border-gray-300 text-gray-600 hover:bg-gray-50 transition">
                            Provide Link
                        </button>
                    </div>
                    <div className="flex items-center space-x-3" style={{ paddingTop: "15px" }}>
                        <h2 className="text-3xl font-bold">Publish to</h2>
                    </div>
                    <div className="w-100 h-10 rounded-xl bg-gradient-to-br from-purple-400 to-blue-500 flex items-center justify-center" />

                    <p className="text-gray-600 max-w-md">
                        Tap into popular websites like Airtable, Get the best content for your
                        Links and Sites. Connect with us and get reach.
                    </p>

                    <div className=" w-42  rounded-full p-[2px] bg-gradient-to-r from-purple-400 to-blue-500 inline-block">
                        <a href="/dashboard/publisher">
                        <button className="px-5 py-3 rounded-full bg-white text-black font-medium hover:bg-purple-50 transition">
                            See all listings →
                        </button>
                        </a>
                    </div>
                </div>

                {/* Right Section */}
                <div className="relative">
                    <Image
                        src="/Image [__wab_img]-7.png"   // put your photo in /public
                        alt="Example"
                        fill                   // makes it cover the parent div
                        className="object-cover rounded-xl"
                    />
                </div>
            </div>

            {/* Top Buttons */}

        </div>
    );
}
