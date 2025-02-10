import pygame
import random
 
# Initialize Pygame
pygame.init()
 
# Set up the game window
width, height = 800, 600
window = pygame.display.set_mode((width, height))
pygame.display.set_caption("Space Shooter")
 
# Define colors
BLACK = (0, 0, 0)
WHITE = (255, 255, 255)
GREEN = (0, 255, 0)
RED = (255, 0, 0)
 
# Player class
class Player(pygame.sprite.Sprite):
    def __init__(self):
        super().__init__()
        self.image =pygame.image.load("player.png")
        self.rect = self.image.get_rect()
        self.rect.centerx = width // 2
        self.rect.bottom = height - 10
        self.speed = 5
 
    def update(self):
        keys = pygame.key.get_pressed()
        if keys[pygame.K_LEFT]:
            self.rect.x -= self.speed
        if keys[pygame.K_RIGHT]:
            self.rect.x += self.speed
        if self.rect.left < 0:
            self.rect.left = 0
        if self.rect.right > width:
            self.rect.right = width
 
# Enemy class
class Enemy(pygame.sprite.Sprite):
    def __init__(self):
        super().__init__()
        self.image = pygame.image.load("enemy.png")
        self.rect = self.image.get_rect()
        self.rect.x = random.randint(0, width - self.rect.width)
        self.rect.y = random.randint(-100, -40)
        self.speedy = random.randint(1, 5)
 
    def update(self):
        self.rect.y += self.speedy
        if self.rect.top > height:
            self.rect.x = random.randint(0, width - self.rect.width)
            self.rect.y = random.randint(-100, -40)
            self.speedy = random.randint(1, 5)
 
# Bullet class
class Bullet(pygame.sprite.Sprite):
    def __init__(self, x, y):
        super().__init__()
        self.image = pygame.image.load("bullet.png")
        self.rect = self.image.get_rect()
        self.rect.centerx = x
        self.rect.bottom = y
        self.speedy = -10
 
    def update(self):
        self.rect.y += self.speedy
        if self.rect.bottom < 0:
            self.kill()
 
# Create sprite groups
all_sprites = pygame.sprite.Group()
enemies = pygame.sprite.Group()
bullets = pygame.sprite.Group()
 
# Create player
player = Player()
all_sprites.add(player)
 
# Create enemies
for i in range(8):
    enemy = Enemy()
    all_sprites.add(enemy)
    enemies.add(enemy)
 
# Game loop
running = True
while running:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False
        elif event.type == pygame.KEYDOWN:
            if event.key == pygame.K_SPACE:
                bullet = Bullet(player.rect.centerx, player.rect.top)
                all_sprites.add(bullet)
                bullets.add(bullet)
 
    # Update
    all_sprites.update()
 
    # Check for bullet-enemy collisions
    hits = pygame.sprite.groupcollide(enemies, bullets, True, True)
    for hit in hits:
        enemy = Enemy()
        all_sprites.add(enemy)
        enemies.add(enemy)
 
    # Draw
    window.fill(BLACK)
    all_sprites.draw(window)
    pygame.display.flip()
 
    pygame.time.delay(30)
 
pygame.quit()

