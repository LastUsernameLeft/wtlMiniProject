var Product =  require('../models/product');
var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/shopping',
        {
                useMongoClient: true
        }
);

var products =
    [
        new Product(
            {
                imagePath: '/images/bioshock.jpg',
                title: 'Bioshock Infinite',
                description: 'Indebted to the wrong people, with his life on the line, veteran of the U.S. Cavalry and now hired gun, Booker DeWitt has only one opportunity to wipe his slate clean. He must rescue Elizabeth, a mysterious girl imprisoned since childhood and locked up in the flying city of Columbia.',
                price: 30
            }),
        new Product(
            {
                imagePath: '/images/crysis.jpg',
                title: 'Crysis 3',
                description: 'Aliens are decimating New York City, only you have the technology to survive. Adapt in real time using the unique Nanosuit 2 Stealth, Armor and Power abilities, then tackle the alien menace in ways a regular soldier could only dream of. Crysis 2 redefines the visual benchmark for console and PC platforms in the urban jungle of NYC.',
                price: 20
            }),
        new Product(
            {
                imagePath: '/images/deusex.jpg',
                title: 'Deus Ex: Mankind Divided',
                description: 'The year is 2029, and mechanically augmented humans have now been deemed outcasts, living a life of complete and total segregation from the rest of society. Now an experienced covert operative, Adam Jensen is forced to operate in a world that has grown to despise his kind. Armed with a new arsenal of state-of-the-art weapons and augmentations, he must choose the right approach, along with who to trust, in order to unravel a vast worldwide conspiracy.',
                price: 60
            }),
        new Product(
            {
                imagePath: '/images/dishonored.jpg',
                title: 'Dishonored 2',
                description: 'Play your way in a world where mysticism and industry collide. Will you choose to play as Empress Emily Kaldwin or the royal protector, Corvo Attano? Will you make your way through the game unseen, make full use of its brutal combat system, or use a blend of both? How will you combine your character\'s unique set of powers, weapons and gadgets to eliminate your enemies? The story responds to your choices, leading to intriguing outcomes, as you play through each of the game\'s hand-crafted missions.',
                price: 40
            }),
        new Product(
            {
                imagePath: '/images/doom.jpg',
                title: 'Doom (2016)',
                description: 'A brutally fun and challenging modern-day shooter experience. Relentless demons, impossibly destructive guns, and fast, fluid movement provide the foundation for intense, first-person combat – whether you’re obliterating demon hordes through the depths of Hell in the single-player campaign, or competing against your friends in numerous multiplayer modes.',
                price: 30
            }),
        new Product(
            {
                imagePath: '/images/gta.jpg',
                title: 'Grand Theft Auto V',
                description: 'When a young street hustler, a retired bank robber and a terrifying psychopath find themselves entangled with some of the most frightening and deranged elements of the criminal underworld, the U.S. government and the entertainment industry, they must pull off a series of dangerous heists to survive in a ruthless city in which they can trust nobody, least of all each other.',
                price: 60
            }),
        new Product(
            {
                imagePath: '/images/ksp.jpg',
                title: 'Kerbal Space Program',
                description: 'In KSP you must build a space-worthy craft, capable of flying its crew out into space without killing them. At your disposal is a collection of parts, which must be assembled to create a functional ship. Each part has its own function and will affect the way a ship flies (or doesn\'t). So strap yourself in, and get ready to try some Rocket Science!',
                price: 40
            }),
        new Product(
            {
                imagePath: '/images/masseffect.jpg',
                title: 'Mass Effect 3',
                description: 'Mass Effect 3 is set within the Milky Way galaxy during the 22nd century where interstellar travel is possible through the use of mass transit devices called Mass Relays, a technology believed to have been built by an extinct alien race known as the Protheans.',
                price: 20
            }),
        new Product(
            {
                imagePath: '/images/minecraft.jpg',
                title: 'Minecraft',
                description: 'Minecraft is a sandbox video game created and designed by Swedish game designer Markus "Notch" Persson, and later fully developed and published by Mojang. The creative and building aspects of Minecraft enable players to build constructions out of textured cubes in a 3D procedurally generated world. Other activities in the game include exploration, resource gathering, crafting, and combat.',
                price: 25
            }),
        new Product(
            {
                imagePath: '/images/skyrim.jpg',
                title: 'The Elder Scrolls V: Skyrim',
                description: 'The next chapter in the highly anticipated Elder Scrolls saga arrives from the makers of the 2006 and 2008 Games of the Year, Bethesda Game Studios. Skyrim reimagines and revolutionizes the open-world fantasy epic, bringing to life a complete virtual world open for you to explore any way you choose. Play any type of character you can imagine, and do whatever you want; the legendary freedom of choice, storytelling, and adventure of The Elder Scrolls is realized like never before.',
                price: 40
            }),
        new Product(
            {
                imagePath: '/images/witcher.jpg',
                title: 'The Witcher 3: Wild Hunt',
                description: 'The Witcher: Wild Hunt is a story-driven, next-generation open world role-playing game set in a visually stunning fantasy universe full of meaningful choices and impactful consequences. In The Witcher you play as the professional monster hunter, Geralt of Rivia, tasked with finding a child of prophecy in a vast open world rich with merchant cities, viking pirate islands, dangerous mountain passes, and forgotten caverns to explore.',
                price: 40
            })
    ];

var done = 0;
for (var i=0; i<products.length; i++)
{
        products[i].save(function (err, result)
        {
            done++;
            if (done === products.length) {
    exit();
}
        });
}

function exit()
{
        mongoose.disconnect();
}