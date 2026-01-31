using AutoMapper;
using Back.DTOs;
using Back.DTOS;
using Back.Models;
using Back.Repositories;
using BCrypt.Net;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Back.Services
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;

        public UserService(IUserRepository userRepository, IMapper mapper)
        {
            _userRepository = userRepository;
            _mapper = mapper;
        }

        // ==========================================
        // MÉTODOS DE LECTURA
        // ==========================================

        public async Task<IEnumerable<UserDTO>> GetAllUsersAsync()
        {
            var usuarios = await _userRepository.GetAllAsync();
            return _mapper.Map<IEnumerable<UserDTO>>(usuarios);
        }

        public async Task<UserDTO?> GetUserByIdAsync(int id)
        {
            var usuario = await _userRepository.GetByIdAsync(id);
            return _mapper.Map<UserDTO>(usuario);
        }

        // ==========================================
        // MÉTODOS DE LÓGICA Y SEGURIDAD
        // ==========================================

        public async Task<UserDTO> RegisterUserAsync(RegisterDTO registerDto)
        {
            // 1. Validaciones
            if (await _userRepository.UserExistsAsync(registerDto.UsuarioNombre))
            {
                throw new Exception("El nombre de usuario ya está en uso.");
            }

            if (await _userRepository.EmailExistsAsync(registerDto.Mail))
            {
                throw new Exception("El correo electrónico ya está registrado.");
            }

            // 2. Mapeo
            var usuarioEntity = _mapper.Map<Usuario>(registerDto);

            // 3. Hasheo Password
            usuarioEntity.Contraseña = BCrypt.Net.BCrypt.HashPassword(registerDto.Contraseña);

            // 4. Guardar
            var resultado = await _userRepository.CreateAsync(usuarioEntity);

            if (!resultado)
            {
                throw new Exception("Error al guardar el usuario en la base de datos.");
            }

            return _mapper.Map<UserDTO>(usuarioEntity);
        }

        public async Task<bool> UpdateUserAsync(int id, UpdateUserDTO updateDto)
        {
            var usuarioExistente = await _userRepository.GetByIdAsync(id);
            if (usuarioExistente == null) return false;

            // Actualiza campos excepto contraseña
            _mapper.Map(updateDto, usuarioExistente);

            return await _userRepository.UpdateAsync(usuarioExistente);
        }

        public async Task<bool> DeleteUserAsync(int id)
        {
            // Asume que tu IUserRepository tiene implementado DeleteAsync
            return await _userRepository.DeleteAsync(id);
        }
    }
}