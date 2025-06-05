var sceneMenu = new Phaser.Class({
    Extends: Phaser.Scene,

    initialize: function () {
        Phaser.Scene.call(this, { key: "sceneMenu" });
    },

    init: function () { },
    preload: function () {
        this.load.setBaseURL('assets/');
        this.load.image('BGPlay', 'images/BGPlay.png');
        this.load.image('Title', 'images/Title.png');
        this.load.image('ButtonPlay', 'images/ButtonPlay.png');
        this.load.image('ButtonSoundOn', 'images/ButtonSoundOn.png');
        this.load.image('ButtonSoundOff', 'images/ButtonSoundOff.png');
        this.load.image('ButtonMusicOn', 'images/ButtonMusicOn.png');
        this.load.image('ButtonMusicOff', 'images/ButtonMusicOff.png');
        this.load.audio('snd_menu', 'audio/music_menu.mp3');
        this.load.audio('snd_touchshooter', 'audio/fx_touch.mp3');
    },
    create: function () {
        // melakukan pengisian nilai untuk variabel global
        X_POSITION = {
            'LEFT': 0,
            'CENTER': game.canvas.width / 2,
            'RIGHT': game.canvas.width,
        };
    
        Y_POSITION = {
            'TOP': 0,
            'CENTER': game.canvas.height / 2,
            'BOTTOM': game.canvas.height,
        };

        // Inisialisasi status sound global jika belum ada
        if (typeof window.isSoundEnabled === 'undefined') {
            window.isSoundEnabled = true;
        }
    
        // membuat tampilan
        // menambahkan backdrop
        this.add.image(X_POSITION.CENTER, Y_POSITION.CENTER, 'BGPlay');
    
        // menambahkan judul game
        var titleGame = this.add.image(X_POSITION.CENTER, Y_POSITION.CENTER - 150, 'Title');
    
        // menambahkan tombol play
        var buttonPlay = this.add.image(X_POSITION.CENTER, Y_POSITION.CENTER + 150, 'ButtonPlay');
    
        // menjadikan tombol play bisa dikenai interaksi (klik, hover mouse)
        buttonPlay.setInteractive();
        
        //menambahkan tombol Sound ke tampilan scene menu
        var buttonSound = this.add.image(X_POSITION.RIGHT - 70, Y_POSITION.BOTTOM - 70, 
            window.isSoundEnabled ? 'ButtonSoundOn' : 'ButtonSoundOff');
        buttonSound.setInteractive();
        
        // menambahkan deteksi input klik mouse dan pergerakan pada mouse
        this.input.on('gameobjectover', function (pointer, gameObject) {
            // melakukan cek jika game objek yang sedang terkena
            // deteksi listener 'gameobjectover' adalah buttonPlay
            if (gameObject === buttonPlay) {
                buttonPlay.setTint(0x999999);
            }
            if (gameObject === buttonSound) {
                buttonSound.setTint(0x999999);
            }
        }, this);

        this.input.on('gameobjectout', function (pointer, gameObject) {
            // melakukan cek jika game objek yang sedang terkena
            // deteksi listener 'gameobjectup' adalah buttonPlay
            if (gameObject === buttonPlay) {
                buttonPlay.setTint(0xffffff);
            }
            if (gameObject === buttonSound) {
                buttonSound.setTint(0xffffff);
            }
        }, this);

        this.input.on('gameobjectup', function (pointer, gameObject) {
            if (gameObject === buttonPlay) {
                buttonPlay.setTint(0xffffff);
                //memainkan sound efek 'touch' setiap kali
                //tombol play yang di-klik, dilepas kliknya
                if (window.isSoundEnabled && snd_touch) {
                    snd_touch.play();
                }
                // FIXED: memanggil scene pilih hero terlebih dahulu, bukan langsung ke play
                this.scene.start('scenePilihHero');
            }
            if (gameObject === buttonSound) {
                buttonSound.setTint(0xffffff);
                
                // Toggle status sound
                window.isSoundEnabled = !window.isSoundEnabled;
                
                // Ganti texture tombol sesuai status
                buttonSound.setTexture(window.isSoundEnabled ? 'ButtonSoundOn' : 'ButtonSoundOff');
                
                // Control semua audio dalam game
                if (window.isSoundEnabled) {
                    // Hidupkan kembali background music jika ada
                    if (this.bgMusic && !this.bgMusic.isPlaying) {
                        this.bgMusic.play();
                    }
                } else {
                    // Matikan semua audio
                    this.sound.pauseAll();
                }
                
                // Play sound effect untuk button click (jika sound enabled)
                if (window.isSoundEnabled && this.btnSound) {
                    this.btnSound.play();
                }
            }
        }, this);

        this.input.on('gameobjectdown', function(pointer, gameObject){
            if(gameObject === buttonSound){
                buttonSound.setTint(0x999999);
            }
        }, this);
        
        // Tambahkan sound effect untuk button click
        this.btnSound = this.sound.add('snd_touchshooter');
        
        // Tambahkan background music
        this.bgMusic = this.sound.add('snd_menu', {
            volume: 0.5,
            loop: true
        });
        
        // Play background music hanya jika sound enabled
        if (window.isSoundEnabled) {
            this.bgMusic.play();
        }
    },    
    update: function () { 
        if (snd_touch == null){
            //jika nilai dari variabel 'snd_touch' masih 'null', maka
            //akan dilakukan pengisian ulang nilai variabel dengan
            //nilai sound yang sesungguhnya, yakni aset sound
            //dengan nama 'snd_touchshooter'
            snd_touch = this.sound.add('snd_touchshooter');
        }
    }  
});