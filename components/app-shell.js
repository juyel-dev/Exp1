<header class="header">
    <div class="container">
        <div class="header-content">
            <a href="#" class="logo" onclick="app.eventBus.emit('navigate', 'home')">
                <div class="logo-icon">
                    <i class="fas fa-chart-network"></i>
                </div>
                <span>GraphzLive</span>
            </a>
            
            <nav class="nav">
                <a href="#" onclick="app.eventBus.emit('navigate', 'home')">Home</a>
                <a href="#" onclick="app.eventBus.emit('navigate', 'graphs')">Graphs</a>
            </nav>
            
            <div id="auth-buttons">
                <button class="btn btn-outline" onclick="app.eventBus.emit('auth:show-modal')">
                    <i class="fas fa-sign-in-alt"></i> Login
                </button>
            </div>
        </div>
    </div>
</header>

<main id="main-content">
    <div class="container text-center p-8">
        <div class="spinner"></div>
        <p>Loading GraphzLive...</p>
    </div>
</main>

<footer class="p-6" style="background: var(--dark); color: white;">
    <div class="container text-center">
        <p>&copy; 2023 GraphzLive. All rights reserved.</p>
    </div>
</footer>
