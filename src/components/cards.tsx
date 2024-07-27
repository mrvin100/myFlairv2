const Cards = () => {
  return (
    <div className="flex items-center justify-center w-full min-h-screen p-10">
      <div className="grid xl:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-2 max-w-6xl">
        <div className="flex flex-col bg-gray-200 rounded-lg p-4 m-2">
          <div className="h-40 bg-gray-400 rounded-lg"></div>
          <div className="flex flex-col items-start mt-4">
            <h4 className="text-xl font-semibold">Heading</h4>
            <p className="text-sm">
              Some text about the thing that goes over a few lines.
            </p>
            <a
              className="p-2 leading-none rounded font-medium mt-3 bg-gray-400 text-xs uppercase"
              href="#"
            >
              Click Here
            </a>
          </div>
        </div>
        <div className="flex flex-col bg-gray-200 rounded-lg p-4 m-2">
          <div className="h-40 bg-gray-400 rounded-lg"></div>
          <div className="flex flex-col items-start mt-4">
            <h4 className="text-xl font-semibold">Heading</h4>
            <p className="text-sm">
              Some text about the thing that goes over a few lines.
            </p>
            <a
              className="p-2 leading-none rounded font-medium mt-3 bg-gray-400 text-xs uppercase"
              href="#"
            >
              Click Here
            </a>
          </div>
        </div>
        <div className="flex flex-col bg-gray-200 rounded-lg p-4 m-2">
          <div className="h-40 bg-gray-400 rounded-lg"></div>
          <div className="flex flex-col items-start mt-4">
            <h4 className="text-xl font-semibold">Heading</h4>
            <p className="text-sm">
              Some text about the thing that goes over a few lines.
            </p>
            <a
              className="p-2 leading-none rounded font-medium mt-3 bg-gray-400 text-xs uppercase"
              href="#"
            >
              Click Here
            </a>
          </div>
        </div>
        <div className="flex flex-col bg-gray-200 rounded-lg p-4 m-2">
          <div className="h-40 bg-gray-400 rounded-lg"></div>
          <div className="flex flex-col items-start mt-4">
            <h4 className="text-xl font-semibold">Heading</h4>
            <p className="text-sm">
              Some text about the thing that goes over a few lines.
            </p>
            <a
              className="p-2 leading-none rounded font-medium mt-3 bg-gray-400 text-xs uppercase"
              href="#"
            >
              Click Here
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cards;
